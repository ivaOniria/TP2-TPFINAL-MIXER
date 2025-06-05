import mongoose from "mongoose";

const productoSchema = mongoose.Schema({ // MODIFICAR PARA USER
    nombre: String,
    precio: Number,
    stock: Number
},{versionKey: false})

export const UserModel = mongoose.model('users', productoSchema)