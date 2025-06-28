import { validar } from './validaciones/sounds.js'
import soundsMongoDB from '../model/DAO/soundsMongoDB.js'
import usersMongoDB from '../model/DAO/models/user.js'
class Servicio {
    #model

    constructor() {
        this.#model = new soundsMongoDB()
    }

    obtenerSonidos = async (id, userId) => {
        if (id) {
            const s = await this.#model.obtenerSonido(id);
            return {
                id: s._id.toString(),
                name: s.title,
                file: s.url,
                category: s.type,
                userName: s.user?.nombre || 'Desconocido'
            };
        }

        if (userId) {
            const sonidos = await this.#model.obtenerSonidosPorUsuario(userId);

            return sonidos.map(s => ({
                id: s._id.toString(),
                name: s.title,
                file: s.url,
                category: s.type,
                userName: s.user?.nombre || 'Desconocido'
            }));
        }
        /*      const sonidos = await this.#model.obtenerSonidos();
                return sonidos; */
        return [];
    };

    guardarSonido = async sonido => {
        /*         const res = validar(sonido)
                if (res.result) { */
        const sonidoGuardado = await this.#model.guardarSonido(sonido)

        if (!sonido.user || !sonido.user._id) {
            throw new Error('El sonido no tiene un usuario válido');
        }

        await usersMongoDB.findByIdAndUpdate(sonido.user._id, {
            $push: { sounds: sonidoGuardado._id }
        });

        return sonidoGuardado
        /*         }
                else {
                    throw new Error(res.error.details[0].message)
                } */
    }

    actualizarSonido = async (id, sonido) => {
        const sonidoActualizado = await this.#model.actualizarSonido(id, sonido)
        return sonidoActualizado
    }

    borrarSonido = async id => {
        const sonidoEliminado = await this.#model.borrarSonido(id)

        // Chequear que funciona
        await usersMongoDB.updateMany(
            { sounds: sonidoEliminado._id },
            { $pull: { sounds: sonidoEliminado._id } }
        );

        return sonidoEliminado
    }

    obtenerEstadisticas = async opcion => {
        const sonidos = await this.#model.obtenerSonidos()
        switch (opcion) {
            case 'cantidad':
                return { cantidad: sonidos.length }

            case 'avg-precio':
                return { 'precio promedio': +(sonidos.reduce((acc, p) => acc + p.precio, 0) / sonidos.length).toFixed(2) }

            case 'min-precio':
                return { 'precio mínimo': +Math.min(...sonidos.map(p => p.precio)).toFixed(2) }

            case 'max-precio':
                return { 'precio máximo': +Math.max(...sonidos.map(p => p.precio)).toFixed(2) }

            default:
                return { error: `opción estadistica '${opcion}' no soportada` }
        }
    }
}

export default Servicio