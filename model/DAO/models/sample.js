import mongoose from "mongoose";

const productoSchema = mongoose.Schema({ // MODIFICAR PARA SAMPLE
    nombre: String,
    precio: Number,
    stock: Number
},{versionKey: false})

export const sampleModel = mongoose.model('samples', productoSchema)