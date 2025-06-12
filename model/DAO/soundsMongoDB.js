import CnxMongoDB from "../DBMongo.js"
import { sonidoModel } from "./models/sound.js"

class ModelMongoDB {
    constructor() {}

    obtenerSonidos = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const sonidos = await sonidoModel.find()
        return sonidos
    }

    obtenerSonido = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const sonido = await sonidoModel.findOne({_id:id})
        return sonido
    }

    guardarSonido = async sonido => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        
        const sonidoModel = new sonidoModel(sonido)
        const sonidoGuardado = await sonidoModel.save()
        return sonidoGuardado
    }

    actualizarSonido = async (id, sonido) => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        await sonidoModel.updateOne({_id:id}, {$set: sonido})
        const sonidoActualizado = await this.obtenerSonido(id)
        return sonidoActualizado
    }

    borrarSonido = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const sonidoBorrado = await this.obtenerSonido(id)
        await sonidoModel.deleteOne({_id: id})
        return sonidoBorrado
    }
}

export default ModelMongoDB