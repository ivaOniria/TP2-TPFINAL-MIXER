import CnxMongoDB from "../DBMongo.js"
import { sampleModel } from "./models/sample.js"

class ModelMongoDB {
    constructor() {}

    obtenerSamples = async () => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const samples = await sampleModel.find()
        return samples
    }

    obtenerSample = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        const sample = await sampleModel.findOne({_id:id})
        return sample
    }

    guardarSample = async sample => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')
        
        const sampleModel = new sampleModel(sample)
        const sampleGuardado = await sampleModel.save()
        return sampleGuardado
    }

    actualizarSample = async (id, sample) => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        await sampleModel.updateOne({_id:id}, {$set: sample})
        const sampleActualizado = await this.obtenerSample(id)
        return sampleActualizado
    }

    borrarSample = async id => {
        if(!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const sampleBorrado = await this.obtenerSample(id)
        await sampleModel.deleteOne({_id: id})
        return sampleBorrado
    }
}

export default ModelMongoDB