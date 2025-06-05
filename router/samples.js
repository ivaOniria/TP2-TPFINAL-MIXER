import express from 'express'
import Controlador from '../controlador/samples.js'


class Router {
    #controlador

    constructor(persistencia) {
        this.#controlador = new Controlador(persistencia)
    }

    start() {    
        const router = express.Router()

        router.get('/:id?', this.#controlador.obtenerSamples)
        router.post('/', this.#controlador.guardarSample)
        router.put('/:id', this.#controlador.actualizarSample)
        router.delete('/:id', this.#controlador.borrarSample)

        router.get('/estadisticas/:opcion', this.#controlador.obtenerEstadisticas)

        return router
    }
}

export default Router