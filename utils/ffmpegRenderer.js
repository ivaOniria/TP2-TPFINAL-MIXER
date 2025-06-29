import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import https from 'https';
import http from 'http';

const execAsync = promisify(exec);

class FFmpegRenderer {
    constructor() {
        this.tempDir = './temp_audio';
        this.outputDir = './rendered_audio';
        this.ensureDirectories();
    }

    // Crear directorios necesarios
    ensureDirectories() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    // Descargar archivo de una URL
    async downloadFile(url, filePath) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            const file = fs.createWriteStream(filePath);
            
            protocol.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Error al descargar: ${response.statusCode}`));
                    return;
                }
                
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
                
                file.on('error', (err) => {
                    fs.unlink(filePath, () => {}); // Limpiar archivo parcial
                    reject(err);
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
    }

    // Procesar eventos y crear estructura de datos para FFmpeg
    processEvents(events) {
        const tracks = {};
        
        // Ordenar eventos por tiempo
        const sortedEvents = events.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
        
        // Agrupar eventos por soundUrl
        sortedEvents.forEach(event => {
            if (!tracks[event.soundUrl]) {
                tracks[event.soundUrl] = {
                    url: event.soundUrl,
                    filename: this.generateFilename(event.soundUrl),
                    segments: [], // Cambiar delays por segments
                    volume: 1.0
                };
            }
            
            const track = tracks[event.soundUrl];
            
            if (event.action === 'play') {
                // Iniciar un nuevo segmento
                track.segments.push({
                    start: event.timeInSeconds,
                    stop: null // Se llenará con el próximo stop
                });
            } else if (event.action === 'stop') {
                // Cerrar el último segmento abierto
                const openSegment = track.segments.find(seg => seg.stop === null);
                if (openSegment) {
                    openSegment.stop = event.timeInSeconds;
                }
            }
        });

        // Procesar tracks y crear instancias para cada segmento
        const trackInstances = [];
        
        Object.values(tracks).forEach(track => {
            track.segments.forEach((segment, segIndex) => {
                if (segment.start !== null) {
                    // Si no hay stop, el segmento va hasta el final
                    const stopTime = segment.stop || null;
                    
                    trackInstances.push({
                        url: track.url,
                        filename: track.filename,
                        localPath: null, // Se llenará después
                        startTime: segment.start,
                        stopTime: stopTime,
                        duration: stopTime ? (stopTime - segment.start) : null,
                        volume: track.volume,
                        segmentIndex: segIndex,
                        originalTrack: track
                    });
                }
            });
        });

        console.log(`🎼 Segmentos procesados:`, trackInstances.map(t => ({
            file: path.basename(t.filename),
            start: t.startTime,
            stop: t.stopTime,
            duration: t.duration
        })));

        return trackInstances;
    }

    // Generar nombre de archivo temporal
    generateFilename(url) {
        const urlParts = url.split('/');
        const originalName = urlParts[urlParts.length - 1];
        const timestamp = Date.now();
        const extension = path.extname(originalName) || '.mp3';
        const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9]/g, '_');
        return `${timestamp}_${baseName}${extension}`;
    }

    // Descargar todos los archivos necesarios
    async downloadAudioFiles(tracks) {
        // Identificar archivos únicos para evitar descargas duplicadas
        const uniqueFiles = {};
        tracks.forEach(track => {
            if (!uniqueFiles[track.url]) {
                uniqueFiles[track.url] = {
                    url: track.url,
                    filename: track.filename,
                    filePath: path.join(this.tempDir, track.filename)
                };
            }
        });

        // Descargar archivos únicos
        const downloadPromises = Object.values(uniqueFiles).map(async (file) => {
            console.log(`📥 Descargando: ${file.url}`);
            
            try {
                await this.downloadFile(file.url, file.filePath);
                console.log(`✅ Descargado: ${file.filename}`);
                return file;
            } catch (error) {
                console.error(`❌ Error descargando ${file.url}:`, error.message);
                throw error;
            }
        });

        // Esperar a que terminen todas las descargas
        const downloadedFiles = await Promise.all(downloadPromises);
        
        // Asignar rutas locales a todos los tracks
        tracks.forEach(track => {
            const downloadedFile = downloadedFiles.find(file => file.url === track.url);
            if (downloadedFile) {
                track.localPath = downloadedFile.filePath;
            }
        });

        return tracks;
    }

    // Generar comando FFmpeg
    generateFFmpegCommand(tracks, sessionInfo) {
        // Agrupar por archivo original para evitar descargas duplicadas
        const uniqueFiles = {};
        tracks.forEach(track => {
            if (!uniqueFiles[track.url]) {
                uniqueFiles[track.url] = {
                    localPath: track.localPath,
                    filename: track.filename
                };
            }
            track.fileIndex = Object.keys(uniqueFiles).indexOf(track.url);
        });

        const inputs = Object.values(uniqueFiles).map(file => `-i "${file.localPath}"`).join(' ');
        const outputFile = path.join(this.outputDir, `mix_${Date.now()}.mp3`);
        
        // Generar filtros para cada segmento
        const filters = tracks.map((track, trackIndex) => {
            const fileIndex = track.fileIndex;
            const delayMs = Math.round(track.startTime * 1000);
            const volume = track.volume || (0.8 / tracks.length);
            
            let filterChain = `[${fileIndex}:a]`;
            
            // Si tiene duración específica (hay stop), recortar el audio
            if (track.duration !== null) {
                const durationSec = track.duration;
                filterChain += `atrim=0:${durationSec},asetpts=PTS-STARTPTS,`;
            }
            
            // Aplicar delay si es necesario
            if (delayMs > 0) {
                filterChain += `adelay=${delayMs}:all=true,`;
            }
            
            // Aplicar volumen
            filterChain += `volume=${volume}[a${trackIndex}]`;
            
            return filterChain;
        }).join(';');

        // Generar amix
        const amixInputs = tracks.map((_, index) => `[a${index}]`).join('');
        const amixFilter = `${amixInputs}amix=inputs=${tracks.length},volume=0.8[out]`;
        
        const filterComplex = `"${filters};${amixFilter}"`;
        
        // Duración total (agregar 5 segundos de margen)
        const duration = Math.ceil(sessionInfo.sessionDuration) + 5;
        
        const command = `ffmpeg ${inputs} -filter_complex ${filterComplex} -map "[out]" -t ${duration} -c:a mp3 -b:a 320k "${outputFile}" -async 1 -y`;
        
        console.log('🎛️ Comando FFmpeg generado:');
        console.log(command);
        
        return { command, outputFile };
    }

    // Ejecutar comando FFmpeg
    async executeFFmpegCommand(command) {
        console.log('🎬 Ejecutando FFmpeg...');
        console.log(`Comando: ${command}`);
        
        try {
            const { stdout, stderr } = await execAsync(command);
            
            if (stderr) {
                console.log('FFmpeg stderr:', stderr);
            }
            
            console.log('✅ Renderizado completado');
            return { success: true, stdout, stderr };
        } catch (error) {
            console.error('❌ Error ejecutando FFmpeg:', error);
            throw error;
        }
    }

    // Limpiar archivos temporales
    async cleanup(tracks) {
        console.log('🧹 Limpiando archivos temporales...');
        
        // Obtener archivos únicos para evitar intentar borrar el mismo archivo múltiples veces
        const uniquePaths = [...new Set(tracks.map(track => track.localPath).filter(path => path))];
        
        const cleanupPromises = uniquePaths.map(filePath => {
            if (fs.existsSync(filePath)) {
                console.log(`🗑️ Eliminando: ${path.basename(filePath)}`);
                return fs.promises.unlink(filePath);
            }
        }).filter(promise => promise); // Filtrar promesas undefined

        try {
            await Promise.all(cleanupPromises);
            console.log('✅ Limpieza completada');
        } catch (error) {
            console.error('⚠️ Error en limpieza:', error);
        }
    }

    // Función principal para renderizar
    async render(eventsData) {
        const { events, sessionInfo } = eventsData;
        
        console.log('🎵 Iniciando renderizado de audio...');
        console.log(`📊 Eventos: ${events.length}, Duración: ${sessionInfo.sessionDuration}s`);
        
        try {
            // 1. Procesar eventos
            const tracks = this.processEvents(events);
            console.log(`🎼 Tracks identificados: ${tracks.length}`);
            
            if (tracks.length === 0) {
                throw new Error('No se encontraron tracks para renderizar');
            }

            // 2. Descargar archivos
            const downloadedTracks = await this.downloadAudioFiles(tracks);
            
            // 3. Generar comando FFmpeg
            const { command, outputFile } = this.generateFFmpegCommand(downloadedTracks, sessionInfo);
            
            // 4. Ejecutar renderizado
            await this.executeFFmpegCommand(command);
            
            // 5. Limpiar archivos temporales
            await this.cleanup(downloadedTracks);
            
            console.log(`🎉 Renderizado exitoso: ${outputFile}`);
            
            return {
                success: true,
                outputFile,
                tracks: downloadedTracks.length,
                duration: sessionInfo.sessionDuration,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('💥 Error en renderizado:', error);
            throw error;
        }
    }
}

export default FFmpegRenderer; 