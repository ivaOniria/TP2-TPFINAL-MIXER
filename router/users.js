import express from 'express'
import Controlador from '../controlador/users.js'


class Router {
    #controlador

    constructor() {
        this.#controlador = new Controlador()
    }

    start() {
        const router = express.Router()
        router.get('/:id?', this.#controlador.obtenerUser)
        router.post('/login', this.#controlador.login)
        router.post('/register', this.#controlador.register)
        router.put('/:id', this.#controlador.actualizarUser)
        router.delete('/:id', this.#controlador.borrarUser)

        return router
    }
}

export default Router