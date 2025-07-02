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

            const sonidos = await this.#servicio.obtenerSonidos(id)
            res.json(sonidos) 
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    
    cargarSonidos = async (req, res) => {
        try {
            const { id } = req.params
            const { userId } = req.query;
            const sonidos = await this.#servicio.cargarSonidos(id, userId)
            res.json(sonidos) 
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    guardarSonido = async (req, res) => {
        try {
            const sonido = req.body
            const sonidoGuardado = await this.#servicio.guardarSonido(sonido)           
            res.status(201).json(sonidoGuardado)
        }
        catch (error) {
            res.status(400).json({ error: error.message })
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

    renderizarSonidos = async (req, res) => {
        try {
            const sonidos = req.body
            const sonidosRenderizados = await this.#servicio.renderizarSonidos(sonidos)
            res.json(sonidosRenderizados)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    descargarArchivo = async (req, res) => {
        try {
            const { filename } = req.params
            const filePath = await this.#servicio.obtenerRutaArchivo(filename)
            
            // Configurar headers para descarga
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
            res.setHeader('Content-Type', 'audio/mpeg')
            
            // Enviar archivo
            res.sendFile(filePath)
        } catch (error) {
            console.error('Error descargando archivo:', error)
            res.status(404).json({ error: 'Archivo no encontrado' })
        }
    }
}

export default Controlador