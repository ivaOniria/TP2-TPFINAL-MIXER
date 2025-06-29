import Servicio from '../servicio/users.js'

class Controlador {
    #servicio

    constructor() {
        this.#servicio = new Servicio()
    }

    obtenerUser = async (req, res) => {
        try {
            const { id } = req.params
            const usuarios = await this.#servicio.obtenerUsers(id)
            res.json(usuarios)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    login = async (req, res) => {
        try {
            const usuario = req.body
            const usuarioLogueado = await this.#servicio.login(usuario)
            res.json(usuarioLogueado)
        }
        catch (error) {
            res.status(401).json({ error: error.message , message: "pasa aca"})
        }
    }

    register = async (req, res) => {
        try {
            const nuevoUsuario = req.body;
            const usuarioCreado = await this.#servicio.register(nuevoUsuario);
            res.status(201).json(usuarioCreado);
        } catch (error) {
            console.error("Error al registrar:", error.message);
            res.status(500).json({ message: error.message });
        }
    };

    guardarUser = async (req, res) => {
        try {
            const usuario = req.body
            // if (!Object.keys(usuario).length) throw new Error('El usuario está vacío')

            const usuarioGuardado = await this.#servicio.guardarUser(usuario)
            res.json(usuarioGuardado)
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    actualizarUser = async (req, res) => {
        try {
            const { id } = req.params
            const usuario = req.body
            const usuarioActualizado = await this.#servicio.actualizarUser(id, usuario)
            res.status(usuarioActualizado ? 200 : 404).json(usuarioActualizado ? usuarioActualizado : {})
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    borrarUser = async (req, res) => {
        try {
            const { id } = req.params
            const usuarioEliminado = await this.#servicio.borrarUser(id)
            res.status(usuarioEliminado ? 200 : 404).json(usuarioEliminado ? usuarioEliminado : {})
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

}

export default Controlador