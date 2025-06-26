import CnxMongoDB from "../DBMongo.js"
import { soundsModel } from "./models/sound.js"
class ModelMongoDB {
    constructor() {}

    obtenerSonidos = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const sonidos = await soundsModel.find()
        return sonidos
    }

    obtenerSonido = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const sonido = await soundsModel.findOne({_id:id})
        return sonido
    }

    guardarSonido = async sonido => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        
        const nuevoSonido = new soundsModel(sonido)
        const sonidoGuardado = await nuevoSonido.save()
        return sonidoGuardado
    }

    actualizarSonido = async (id, sonido) => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        await soundsModel.updateOne({_id:id}, {$set: sonido})
        const sonidoActualizado = await this.obtenerSonido(id)
        return sonidoActualizado
    }

    borrarSonido = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const sonidoBorrado = await this.obtenerSonido(id)
        await soundsModel.deleteOne({_id: id})
        return sonidoBorrado
    }
}

export default ModelMongoDB