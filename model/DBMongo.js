import config from '../config.js'
import mongoose from 'mongoose'

class CnxMongoDB {
    static connectionOK = false

    static conectar = async _ => {
        try {
            console.log('Conectando a la base de datos (mongoose)...')
            await mongoose.connect(config.STRCNX + '/' + config.BASE)
            console.log('Base de datos conectada!')

            CnxMongoDB.connectionOK = true
        }
        catch(error) {
            console.log(`Error en conexión de base datos: ${error.message}`)
        }
    }
}

export default CnxMongoDB