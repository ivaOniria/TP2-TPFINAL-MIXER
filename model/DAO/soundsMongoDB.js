import CnxMongoDB from "../DBMongo.js"
import { soundsModel } from "./models/sound.js"
class soundsMongoDB {
    constructor() { }

    obtenerSonidos = async (userId) => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        if (userId) {
            // Si se especifica un userId, obtener sonidos de ese usuario
            return await soundsModel
                .find({ user: userId })
                .populate('user', 'nombre');

        } else {
            // Si no se especifica userId, obtener todos los sonidos
            return await soundsModel
                .find()
                .populate('user', 'nombre');
        }
    };

    obtenerSonido = async id => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        return await soundsModel
            .findById(id)
            .populate('user', 'nombre');
    };

    obtenerSonidosPorUsuario = async userId => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS');
        return await soundsModel
            .find({ user: userId })
            .populate('user', 'nombre')
            .sort({ _id: -1 })
    }

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

    async borrarSonidosDelUsuario(userId) {
        try {
            const resultado = await soundsModel.deleteMany({ user: userId });
            console.log(`Sonidos borrados del usuario ${userId}:`, resultado.deletedCount);
            return resultado;
        } catch (error) {
            console.error(`Error al borrar sonidos del usuario ${userId}:`, error);
            throw error;
        }
    }
}

export default soundsMongoDB