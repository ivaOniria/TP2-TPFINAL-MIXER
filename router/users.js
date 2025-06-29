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
        router.post('/register', this.#controlador.register)
        router.get('/:id?', this.#controlador.obtenerUser)
        router.post('/', this.#controlador.guardarUser)
        router.put('/:id', this.#controlador.actualizarUser)
        router.delete('/:id', this.#controlador.borrarUser)
        
        return router
    }
}

export default Router