import express from 'express'
import Routersamples from './router/samples.js'
import RouterUsers from './router/users.js'

class Server {
    #port

    constructor(port) {
        this.#port = port
    }

    start() {
        // -----------------------------------------------
        //             APLICACIÓN EXPRESS
        // -----------------------------------------------
        const app = express()

        // -----------------------------------------------
        //            MIDDLEWARES EXPRESS
        // -----------------------------------------------
        app.use(express.static('public'))
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))

        // -----------------------------------------------
        //           API RESTful: samples
        // -----------------------------------------------
        app.use('/api/samples', new Routersamples().start())
        app.use('/api/users', new RouterUsers().start()) 

        // -----------------------------------------------
        //        LISTEN DEL SERVIDOR EXPRESS
        // -----------------------------------------------
        const PORT = this.#port
        const server = app.listen(PORT, () => console.log(`Servidor express escuchando en http://localhost:${PORT}`))
        server.on('error', error => console.log(`Error en servidor: ${error.message}`))
    }
}

export default Server