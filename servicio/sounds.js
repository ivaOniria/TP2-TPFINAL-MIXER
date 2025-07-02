import { validar } from './validaciones/sounds.js'
import soundsMongoDB from '../model/DAO/soundsMongoDB.js'
import usersMongoDB from '../model/DAO/usersMongoDB.js'
import { id as idUserGeneral } from "../src/constantes/userGeneral.js";
import FFmpegRenderer from '../utils/ffmpegRenderer.js';
import path from 'path';
import fs from 'fs';

class Servicio {
    #model
    #modelUsers
    #ffmpegRenderer

    constructor() {
        this.#model = new soundsMongoDB()
        this.#modelUsers = new usersMongoDB()
        this.#ffmpegRenderer = new FFmpegRenderer()
    }

    obtenerSonidos = async id => {
        if (id) {
            const user = await this.#model.obtenerSonido(id)
            return user
        }
        else {
            const users = await this.#model.obtenerSonidos()
            return users
        }
    }

    cargarSonidos = async (userId) => {
        const sonidosADevolver = [];

        if (userId) {
            const sonidos = await this.#model.obtenerSonidosPorUsuario(userId);
            sonidosADevolver.push(...sonidos.map(s => ({
                id: s._id.toString(),
                name: s.title,
                file: s.url,
                category: s.type,
                userName: s.user?.nombre || 'Desconocido',
                userId: s.user._id
            })));
        }

        if (userId !== idUserGeneral) {

            const sonidosBase = await this.#model.obtenerSonidos(idUserGeneral);
            sonidosADevolver.push(...sonidosBase.map(s => ({
                id: s._id.toString(),
                name: s.title,
                file: s.url,
                category: s.type,
                userName: s.user?.nombre || 'General',
                userId: s.user._id
            })));
        }
        return sonidosADevolver;
    };

<<<<<<< HEAD
guardarSonido = async (sonido) => {
    const res = validar(sonido, 'POST'); 
    if (!res.result) {
        const mensaje = res.error.details.map(e => e.message).join(', ');
        throw new Error(`Error de validación: ${mensaje}`);
=======
    guardarSonido = async sonido => {
        const res = validar(sonido)
        if (res.result) {
            const sonidoGuardado = await this.#model.guardarSonido(sonido)
            if (!sonidoGuardado.user) {
                throw new Error('El sonido no tiene un usuario válido');
            }

            await this.#modelUsers.guardarSonidoEnUsuario(sonidoGuardado)
            return sonidoGuardado
        } else {
            throw new Error(res.error.details[0].message)
        }
>>>>>>> 53c576bc77e50def77b73ae961c4bbc09db78e50
    }

    const sonidoGuardado = await this.#model.guardarSonido(sonido);
    if (!sonidoGuardado.user) {
        throw new Error('El sonido no tiene un usuario válido');
    }

    await this.#modelUsers.guardarSonidoEnUsuario(sonidoGuardado);

    return sonidoGuardado;
}

    actualizarSonido = async (id, sonido) => {
        const sonidoActualizado = await this.#model.actualizarSonido(id, sonido)
        return sonidoActualizado
    }

    borrarSonido = async id => {
        const sonidoEliminado = await this.#model.borrarSonido(id)
        await this.#modelUsers.borrarSonidoDeUsuario(sonidoEliminado._id, sonidoEliminado.user._id);
        return sonidoEliminado
    }

    renderizarSonidos = async (eventsData) => {
        console.log('🎬 Iniciando renderizado de sesión...');
        console.log('Datos recibidos:', JSON.stringify(eventsData, null, 2));

        try {
            // Usar la utilidad FFmpeg para renderizar
            const result = await this.#ffmpegRenderer.render(eventsData);

            // Extraer solo el nombre del archivo
            const filename = path.basename(result.outputFile);

            console.log('✅ Renderizado completado exitosamente');
            return {
                success: true,
                message: 'Sesión renderizada exitosamente',
                downloadUrl: `/api/sounds/download/${filename}`,
                filename: filename,
                result
            };

        } catch (error) {
            console.error('❌ Error renderizando sesión:', error);
            throw new Error(`Error en renderizado: ${error.message}`);
        }
    }

    obtenerRutaArchivo = async (filename) => {
        const filePath = path.resolve('./rendered_audio', filename);

        // Verificar que el archivo existe
        if (!fs.existsSync(filePath)) {
            throw new Error(`Archivo no encontrado: ${filename}`);
        }

        // Verificar que está en la carpeta correcta (seguridad)
        const resolvedDir = path.resolve('./rendered_audio');
        if (!filePath.startsWith(resolvedDir)) {
            throw new Error('Acceso no autorizado al archivo');
        }

        return filePath;
    }
}

export default Servicio