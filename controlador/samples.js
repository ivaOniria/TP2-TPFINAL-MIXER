import Servicio from '../servicio/samples.js'


class Controlador {
    #servicio

    constructor() {
            this.#servicio = new Servicio()
    }

    obtenerSamples = async (req, res) => {
        try {
            const { id } = req.params
            const samples = await this.#servicio.obtenerSamples(id)
            res.json(samples)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    guardarSample = async (req, res) => {
        try {
            const sample = req.body
            // if (!Object.keys(sample).length) throw new Error('El sample está vacío')

            const sampleGuardado = await this.#servicio.guardarSample(sample)
            res.json(sampleGuardado)
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    actualizarSample = async (req, res) => {
        try {
            const { id } = req.params
            const sample = req.body
            const sampleActualizado = await this.#servicio.actualizarSample(id, sample)
            res.status(sampleActualizado ? 200 : 404).json(sampleActualizado ? sampleActualizado : {})
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    borrarSample = async (req, res) => {
        try {
            const { id } = req.params
            const sampleEliminado = await this.#servicio.borrarSample(id)
            res.status(sampleEliminado ? 200 : 404).json(sampleEliminado ? sampleEliminado : {})
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    obtenerEstadisticas = async (req, res) => {
        try {
            const { opcion } = req.params
            const estadisticas = await this.#servicio.obtenerEstadisticas(opcion)
            res.json({ estadisticas })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default Controlador