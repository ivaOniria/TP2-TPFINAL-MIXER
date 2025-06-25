import express from 'express'
import RouterSonidos from './router/sounds.js'
import RouterUsers from './router/users.js'
import cors from 'cors'
import dotenv from 'dotenv';

class Server {
    #port

    constructor(port) {
        this.#port = port
    }

    start() {

        dotenv.config()
        // -----------------------------------------------
        //             APLICACIÓN EXPRESS
        // -----------------------------------------------
        const app = express()

        // -----------------------------------------------
        //            MIDDLEWARES EXPRESS
        // -----------------------------------------------
        app.use(cors())
        app.use(express.static('public'))
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        // -----------------------------------------------
        //           API RESTful: sonidos
        // -----------------------------------------------
        app.use('/api/sonidos', new RouterSonidos().start())
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