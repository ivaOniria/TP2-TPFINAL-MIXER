import mongoose from "mongoose";

// User debería tener la referencia a todos sus sonidos.
const userSchema = mongoose.Schema({ 
    nombre: String,
    email: String,
    password: String,  
    sounds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sounds'
  }]

},{versionKey: false})

const usersModel = mongoose.model('users', userSchema) 

export default usersModel