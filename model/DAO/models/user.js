import mongoose from "mongoose";

const userSchema = mongoose.Schema({ // MODIFICAR PARA USER
    nombre: String,
    email: String,
    password: String,  
},{versionKey: false})

const usersModel = mongoose.model('users', userSchema)

export default usersModel