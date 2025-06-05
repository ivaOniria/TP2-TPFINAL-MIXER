import CnxMongoDB from "../DBMongo.js"
import { userModel } from "./models/user.js"

class ModelMongoDB {
    constructor() {}

    obtenerUsers = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const users = await userModel.find()
        return users
    }

    obtenerUser = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const user = await userModel.findOne({_id:id})
        return user
    }

    guardarUser = async user => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        
        const userModel = new userModel(user)
        const userGuardado = await userModel.save()
        return userGuardado
    }

    actualizarUser = async (id, user) => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        await userModel.updateOne({_id:id}, {$set: user})
        const userActualizado = await this.obtenerUser(id)
        return userActualizado
    }

    borrarUser = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const userBorrado = await this.obtenerUser(id)
        await userModel.deleteOne({_id: id})
        return userBorrado
    }
}

export default ModelMongoDB