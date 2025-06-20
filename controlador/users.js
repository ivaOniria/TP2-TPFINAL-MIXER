import Servicio from '../servicio/users.js'

class Controlador {
    #servicio

    constructor() {
        this.#servicio = new Servicio()
    }

    obtenerUsuarios = async (req, res) => {
        try {
            const { id } = req.params
            const usuarios = await this.#servicio.obtenerUsuarios(id)
            res.json(usuarios)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    guardarUsuario = async (req, res) => {
        try {
            const usuario = req.body
            // if (!Object.keys(usuario).length) throw new Error('El usuario está vacío')

            const usuarioGuardado = await this.#servicio.guardarUsuario(usuario)
            res.json(usuarioGuardado)
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    actualizarUsuario = async (req, res) => {
        try {
            const { id } = req.params
            const usuario = req.body
            const usuarioActualizado = await this.#servicio.actualizarUsuario(id, usuario)
            res.status(usuarioActualizado ? 200 : 404).json(usuarioActualizado ? usuarioActualizado : {})
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    borrarUsuario = async (req, res) => {
        try {
            const { id } = req.params
            const usuarioEliminado = await this.#servicio.borrarUsuario(id)
            res.status(usuarioEliminado ? 200 : 404).json(usuarioEliminado ? usuarioEliminado : {})
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