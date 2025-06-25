import CnxMongoDB from "../DBMongo.js"
import usersModel from "./models/user.js"

class usersMongoDB {
    constructor() {}

    obtenerUsers = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const users = await usersModel.find()
        return users
    }

    obtenerUser = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const user = await usersModel.findOne({_id:id})
        return user
    }

    guardarUser = async user => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        
        const userModel = new usersModel(user)
        const userGuardado = await userModel.save()
        return userGuardado
    }

    actualizarUser = async (id, user) => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        await usersModel.updateOne({_id:id}, {$set: user})
        const userActualizado = await this.obtenerUser(id)
        return userActualizado
    }

    borrarUser = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const userBorrado = await this.obtenerUser(id)
        await usersModel.deleteOne({_id: id})
        return userBorrado
    }

    login = async (usuario) => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const usuarioLogueado = await usersModel.findOne({email: usuario.email, password: usuario.password})
        return usuarioLogueado
    }
}
export default usersMongoDB
