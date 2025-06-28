import CnxMongoDB from "../DBMongo.js"
import { soundsModel } from "./models/sound.js"
class soundsMongoDB {
    constructor() { }

    obtenerSonido = async id => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        return await soundsModel
            .findById(id)
            .populate('user', 'nombre');
    };

    obtenerSonidosPorUsuario = async userId => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        return await soundsModel
            .find({ user: userId })
            .populate('user', 'nombre');
    };

    guardarSonido = async sonido => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const nuevoSonido = new soundsModel(sonido)
        const sonidoGuardado = await nuevoSonido.save()
        return sonidoGuardado
    }

    actualizarSonido = async (id, sonido) => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        await soundsModel.updateOne({ _id: id }, { $set: sonido })
        const sonidoActualizado = await this.obtenerSonido(id)
        return sonidoActualizado
    }

    borrarSonido = async id => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const sonidoBorrado = await this.obtenerSonido(id)
        await soundsModel.deleteOne({ _id: id })
        return sonidoBorrado
    }
}

export default soundsMongoDB