import { validar } from './validaciones/sounds.js'
import soundsMongoDB from '../model/DAO/soundsMongoDB.js'
import usersMongoDB from '../model/DAO/usersMongoDB.js'
import { id as idUserGeneral } from "../src/constantes/userGeneral.js";
class Servicio {
    #model
    #modelUsers

    constructor() {
        this.#model = new soundsMongoDB()
        this.#modelUsers = new usersMongoDB()
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

    guardarSonido = async sonido => {
        /*         const res = validar(sonido)
                if (res.result) { */
        const sonidoGuardado = await this.#model.guardarSonido(sonido)
        if (!sonidoGuardado.user) {
            throw new Error('El sonido no tiene un usuario válido');
        }

        await this.#modelUsers.guardarSonidoEnUsuario(sonidoGuardado)
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
        await this.#modelUsers.borrarSonidoDeUsuario(sonidoEliminado._id, sonidoEliminado.user._id);
        return sonidoEliminado
    }
}

export default Servicio