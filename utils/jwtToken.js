import usersMongoDB from "../model/DAO/usersMongoDB.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CnxMongoDB from "../model/DBMongo.js"

class jwtToken {

    #model

     constructor() {
        this.#model = new usersMongoDB()

    }

    login = async (usuario) => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS')

        const usuarioEnBD = await this.#model.obtenerUserPorMail(usuario);
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
            }
        };
    }

    register = async (usuario) => {
        if (!CnxMongoDB.connectionOK) throw new Error('ERROR CNX BASE DE DATOS');
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(usuario.password, saltRounds);

        const nuevoUsuario = {
            nombre: usuario.nombre,
            email: usuario.email,
            password: hashedPassword,
        };
        
        await this.#model.register(nuevoUsuario)

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
            }
        };
    }

}

export default jwtToken