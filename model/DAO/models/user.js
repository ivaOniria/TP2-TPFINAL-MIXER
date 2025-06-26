import mongoose from "mongoose";

// User debería tener la referencia a todos sus sonidos.
const userSchema = mongoose.Schema({ 
    nombre: String,
    email: String,
    password: String,  
},{versionKey: false})

const usersModel = mongoose.model('users', userSchema)

export default usersModel