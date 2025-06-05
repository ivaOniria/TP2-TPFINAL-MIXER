import { validar } from './validaciones/samples.js'
import ModelMongoDB from '../model/DAO/samplesMongoDB.js'


class Servicio {
    #model

    constructor() {
        this.#model = new ModelMongoDB()
    }

    obtenerSamples = async id => {
        if(id) {
            const sample = await this.#model.obtenerSample(id)
            return sample
        }
        else {
            const samples = await this.#model.obtenerSamples()
            return samples
        }
    }

    guardarSample = async sample => {
        const res = validar(sample)
        if(res.result) {
            const sampleGuardado = await this.#model.guardarSample(sample)
            return sampleGuardado
        }
        else {
            throw new Error(res.error.details[0].message)
        }
    }

    actualizarSample = async (id,sample) => {
        const sampleActualizado = await this.#model.actualizarSample(id,sample)
        return sampleActualizado
    }

    borrarSample = async id => {
        const sampleEliminado = await this.#model.borrarSample(id)
        return sampleEliminado
    }

    obtenerEstadisticas = async opcion => {
        const samples = await this.#model.obtenerSamples()
        switch(opcion) {
            case 'cantidad':
                return { cantidad: samples.length }

            case 'avg-precio':
                return { 'precio promedio': +(samples.reduce((acc,p) => acc + p.precio, 0) / samples.length).toFixed(2) }

            case 'min-precio':
                return { 'precio mínimo': +Math.min(...samples.map(p => p.precio)).toFixed(2) }

            case 'max-precio':
                return { 'precio máximo': +Math.max(...samples.map(p => p.precio)).toFixed(2) }

            default:
                return { error: `opción estadistica '${opcion}' no soportada` }
        }
    }
}

export default Servicio