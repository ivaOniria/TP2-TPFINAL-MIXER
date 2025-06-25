import mongoose from "mongoose";

const sonidoSchema = mongoose.Schema({ // MODIFICAR PARA SONIDO
    nombre: String,
    url: String,
    tipo: String,
    tamanio: Number,
    duracion : Number, //en segundos        
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios'
    }

},{versionKey: false})

export const sonidoModel = mongoose.model('sonidos', sonidoSchema)