# FFmpeg Audio Renderer

Esta utilidad permite renderizar sesiones de audio mixeando múltiples tracks con timing preciso basado en eventos de reproducción.

## Requisitos

### FFmpeg
Debes tener FFmpeg instalado en tu sistema:

**Windows:**
```bash
# Descargar desde https://ffmpeg.org/download.html
# O usar Chocolatey:
choco install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg  # Ubuntu/Debian
sudo yum install ffmpeg  # CentOS/RHEL
```

## Cómo funciona

### 1. Entrada de datos
La utilidad recibe el formato de eventos del frontend:
```json
{
  "events": [
    {
      "soundUrl": "https://ejemplo.com/drum.mp3",
      "timeInSeconds": 0.5,
      "action": "play"
    },
    {
      "soundUrl": "https://ejemplo.com/bass.mp3", 
      "timeInSeconds": 4.5,
      "action": "play"
    }
  ],
  "sessionInfo": {
    "sessionDuration": 28,
    "totalEvents": 6
  }
}
```

### 2. Procesamiento
1. **Procesa eventos play/stop** ordenados por tiempo
2. **Crea segmentos de audio** respetando tiempos de inicio y fin
3. **Descarga archivos únicos** a carpeta temporal `./temp_audio/`
4. **Genera comando FFmpeg** con delays precisos y recortes `atrim`
5. **Ejecuta renderizado** creando mix final con timing exacto
6. **Limpia archivos** temporales

### 3. Comando FFmpeg generado
```bash
# Ejemplo con segmentos que incluyen eventos de stop:
ffmpeg -i "temp_audio/1234_Drums_1.mp3" -i "temp_audio/1234_Bass_1.mp3" 
-filter_complex "[0:a]atrim=0:16,asetpts=PTS-STARTPTS,volume=0.4[a0];[0:a]atrim=0:15.5,asetpts=PTS-STARTPTS,adelay=12500:all=true,volume=0.4[a1];[1:a]atrim=0:22,asetpts=PTS-STARTPTS,adelay=4500:all=true,volume=0.4[a2];[a0][a1][a2]amix=inputs=3,volume=0.8[out]" 
-map "[out]" -t 33 -c:a mp3 -b:a 320k "rendered_audio/mix_1751234567890.mp3" -async 1 -y
```

### 4. Salida
- Archivo MP3 renderizado en `./rendered_audio/`
- Respuesta JSON con información del proceso

## Estructura de carpetas

```
/proyecto
├── temp_audio/          # Archivos temporales (se limpian automáticamente)
├── rendered_audio/      # Archivos finales renderizados  
└── utils/
    └── ffmpegRenderer.js # Utilidad principal
```

## Manejo de eventos de Stop

El sistema ahora procesa correctamente los eventos de **stop**, creando segmentos de audio que respetan los tiempos exactos:

### Ejemplo de sesión:
```json
{
  "events": [
    {"soundUrl": "drum.mp3", "timeInSeconds": 0.5, "action": "play"},
    {"soundUrl": "bass.mp3", "timeInSeconds": 4.5, "action": "play"},
    {"soundUrl": "drum.mp3", "timeInSeconds": 12.5, "action": "play"},
    {"soundUrl": "drum.mp3", "timeInSeconds": 16.5, "action": "stop"},
    {"soundUrl": "bass.mp3", "timeInSeconds": 26.5, "action": "stop"},
    {"soundUrl": "drum.mp3", "timeInSeconds": 28, "action": "stop"}
  ]
}
```

### Resultado procesado:
- **Drum segmento 1**: 0.5s → 16.5s (duración: 16s)
- **Drum segmento 2**: 12.5s → 28s (duración: 15.5s)  
- **Bass segmento 1**: 4.5s → 26.5s (duración: 22s)

Cada segmento se renderiza usando `atrim` de FFmpeg para recortar exactamente la duración correcta.

## Características

- ✅ **Descarga automática** de archivos desde URLs
- ✅ **Timing preciso** usando `adelay` de FFmpeg
- ✅ **Recorte exacto** usando `atrim` para eventos de stop
- ✅ **Volúmenes balanceados** automáticamente
- ✅ **Limpieza automática** de archivos temporales  
- ✅ **Soporte stereo** con `:all=true`
- ✅ **Calidad alta** (320kbps MP3)
- ✅ **Manejo de errores** robusto

## Ejemplo de uso

```javascript
import FFmpegRenderer from './utils/ffmpegRenderer.js';

const renderer = new FFmpegRenderer();

const sessionData = {
  events: [...],
  sessionInfo: {...}
};

try {
  const result = await renderer.render(sessionData);
  console.log('Renderizado exitoso:', result.outputFile);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Logs de ejemplo

```
🎵 Iniciando renderizado de audio...
📊 Eventos: 6, Duración: 28s
🎼 Tracks identificados: 3
📥 Descargando: https://ejemplo.com/drum.mp3
✅ Descargado: 1234_Drums_1.mp3
🎬 Ejecutando FFmpeg...
✅ Renderizado completado
🧹 Limpiando archivos temporales...
✅ Limpieza completada
🎉 Renderizado exitoso: rendered_audio/mix_1234567890.mp3
``` 