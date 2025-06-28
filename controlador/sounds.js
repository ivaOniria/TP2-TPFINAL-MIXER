import Servicio from '../servicio/sounds.js'


class Controlador {
    #servicio

    constructor() {
        this.#servicio = new Servicio()
    }

    obtenerSonidos = async (req, res) => {
        try {
            const { id } = req.params
            const { userId } = req.query;

            const sonidos = await this.#servicio.obtenerSonidos(id, userId)
            res.json(sonidos) 
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    guardarSonido = async (req, res) => {
        try {
            const sonido = req.body
            // if (!Object.keys(sonido).length) throw new Error('El sonido está vacío')

            const sonidoGuardado = await this.#servicio.guardarSonido(sonido)
            res.json(sonidoGuardado)
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    actualizarSonido = async (req, res) => {
        try {
            const { id } = req.params
            const sonido = req.body
            const sonidoActualizado = await this.#servicio.actualizarSonido(id, sonido)
            res.status(sonidoActualizado ? 200 : 404).json(sonidoActualizado ? sonidoActualizado : {})
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    borrarSonido = async (req, res) => {
        try {
            const { id } = req.params
            const sonidoEliminado = await this.#servicio.borrarSonido(id)
            res.status(sonidoEliminado ? 200 : 404).json(sonidoEliminado ? sonidoEliminado : {})
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