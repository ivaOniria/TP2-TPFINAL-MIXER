import { validar } from './validaciones/sounds.js'
import ModelMongoDB from '../model/DAO/soundsMongoDB.js'

class Servicio {
    #model

    constructor() {
        this.#model = new ModelMongoDB()
    }

    obtenerSonidos = async id => {
        if(id) {
            const sonido = await this.#model.obtenerSonido(id)
            return sonido
        }
        else {
            const sonidos = await this.#model.obtenerSonidos()
            return sonidos
        }
    }

    guardarSonido = async sonido => {
        //const res = validar(sonido)
        //if(res.result) {
            
            const sonidoGuardado = await this.#model.guardarSonido(sonido)
            return sonidoGuardado
        //}
/*         else {
            throw new Error(res.error.details[0].message)
        } */
    }

    actualizarSonido = async (id,sonido) => {
        const sonidoActualizado = await this.#model.actualizarSonido(id,sonido)
        return sonidoActualizado
    }

    borrarSonido = async id => {
        const sonidoEliminado = await this.#model.borrarSonido(id)
        return sonidoEliminado
    }

    obtenerEstadisticas = async opcion => {
        const sonidos = await this.#model.obtenerSonidos()
        switch(opcion) {
            case 'cantidad':
                return { cantidad: sonidos.length }

            case 'avg-precio':
                return { 'precio promedio': +(sonidos.reduce((acc,p) => acc + p.precio, 0) / sonidos.length).toFixed(2) }

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