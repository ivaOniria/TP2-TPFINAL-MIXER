import mongoose from "mongoose";

const sonidoSchema = mongoose.Schema({ // MODIFICAR PARA sonido
    nombre: String,
    url: String,
    tipo: String,
    tamanio: Number
},{versionKey: false})

export const sonidoModel = mongoose.model('sonidos', sonidoSchema)