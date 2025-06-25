import CnxMongoDB from "../DBMongo.js"
import usersModel from "./models/user.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

        const usuarioEnBD = await usersModel.findOne({ email: usuario.email });
        if (!usuarioEnBD) {
            throw new Error('Email o contraseña incorrectos');
        }

        const passwordOK = await bcrypt.compare(usuario.password, usuarioEnBD.password);
        if (!passwordOK) {
            throw new Error('Email o contraseña incorrectos');
        }
        const token = jwt.sign(
            { id: usuarioEnBD._id, email: usuarioEnBD.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            access_token: token,
            expires_in: 3600,
            user: {
                _id: usuarioEnBD._id,
                nombre: usuarioEnBD.nombre,
                email: usuarioEnBD.email,
            }};
}

    register = async (usuario) => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS');
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(usuario.password, saltRounds);

            const nuevoUsuario = await usersModel.create({
            nombre: usuario.nombre,
            email: usuario.email,
            password: hashedPassword,
            });

        const token = jwt.sign({ id: nuevoUsuario._id, email: nuevoUsuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' });

        return {
        access_token: token,
        expires_in: 3600,
        user: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
    }};
    }

    // ALTERNATIVA A VERIFICAR SI EXISTE
    buscarPorEmail = async (email) => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS');
        return await usersModel.findOne({ email });
        };
    



}
export default usersMongoDB
