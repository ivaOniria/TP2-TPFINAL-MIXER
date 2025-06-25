import express from 'express'
import Controlador from '../controlador/users.js'


class Router {
    #controlador

    constructor() {
        this.#controlador = new Controlador()
    }

    start() {    
        const router = express.Router()
        router.post('/login', this.#controlador.login)
        router.get('/:id?', this.#controlador.obtenerUsuarios)
        router.post('/', this.#controlador.guardarUsuario)
        router.put('/:id', this.#controlador.actualizarUsuario)
        router.delete('/:id', this.#controlador.borrarUsuario)

        router.get('/estadisticas/:opcion', this.#controlador.obtenerEstadisticas)

        return router
    }
}

export default Router