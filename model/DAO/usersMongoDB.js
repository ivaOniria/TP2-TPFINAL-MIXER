import CnxMongoDB from "../DBMongo.js"
import usersModel from "./models/user.js"

class usersMongoDB {
    constructor() { }

    obtenerUsers = async () => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const users = await usersModel.find()
        return users
    }

    obtenerUserPorMail = async (usuario) => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const user = await usersModel.findOne({ email: usuario.email })
        return user
    }

    obtenerUser = async id => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const user = await usersModel.findOne({ _id: id })
        return user
    }

    actualizarUser = async (id, user) => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        await usersModel.updateOne({ _id: id }, { $set: user })
        const userActualizado = await this.obtenerUser(id)
        return userActualizado
    }

    borrarUser = async id => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const userBorrado = await this.obtenerUser(id)
        await usersModel.deleteOne({ _id: id })
        return userBorrado
    }

    register = async user => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const userModel = new usersModel(user)
        const userGuardado = await userModel.save()
        return userGuardado
    }

    buscarPorEmail = async (email) => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS');
        return await usersModel.findOne({ email });
    };

    borrarSonidoDeUsuario = async (idSound, idUser) => {
        const resultado = await usersModel.updateOne(
            { _id: idUser },
            { $pull: { sounds: idSound } }
        )
        return resultado
    }

    guardarSonidoEnUsuario = async sonido => {
        await usersModel.findByIdAndUpdate(sonido.user._id, {
            $push: { sounds: sonido._id }
        });
        return sonido
    }
}
export default usersMongoDB
