import express from 'express'
import Controlador from '../controlador/sounds.js'


class Router {
    #controlador

    constructor() {
        this.#controlador = new Controlador()
    }

    start() {    
        const router = express.Router()

        router.get('/:id?', this.#controlador.obtenerSonidos)
        router.post('/', this.#controlador.guardarSonido)
        router.put('/:id', this.#controlador.actualizarSonido)
        router.delete('/:id', this.#controlador.borrarSonido)

        router.get('/estadisticas/:opcion', this.#controlador.obtenerEstadisticas)

        return router
    }
}

export default Router