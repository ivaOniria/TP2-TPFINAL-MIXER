import usersMongoDB from '../model/DAO/usersMongoDB.js'
import { validar } from './validaciones/users.js'
import { sendEmail } from '../utils/nodemailer.js';
import jwtToken from '../utils/jwtToken.js';
import soundsMongoDB from '../model/DAO/soundsMongoDB.js'
class Servicio {
    #model
    #modelSounds

    constructor() {
        this.#model = new usersMongoDB()
        this.#modelSounds = new soundsMongoDB()
    }

    obtenerUsers = async id => {
        if (id) return await this.#model.obtenerUser(id);
        return await this.#model.obtenerUsers();
    }

    login = async (user) => {
        const res = validar(user, 'login');
        if (!res.result) {
            const mensaje = res.error.details.map(e => e.message).join(', ');
            throw new Error(`Error de validación: ${mensaje}`);
        }

        const usuarioEnBD = await this.#model.obtenerUserPorMail(user);
        if (!usuarioEnBD) throw new Error('Email o contraseña incorrectos');

        const passwordOK = await jwtToken.verificarPassword(user.password, usuarioEnBD.password);
        if (!passwordOK) throw new Error('Email o contraseña incorrectos');

        return jwtToken.generarToken(usuarioEnBD);
    }

    register = async (user) => {
        const res = validar(user, 'register');
        if (!res.result) {
            const mensaje = res.error.message;
            throw new Error(`Error: ${mensaje}`);
        }

        const existente = await this.#model.buscarPorEmail(user.email);
        if (existente) throw new Error('El email ya está registrado');

        const hashedPassword = await jwtToken.hashearPassword(user.password);

        const nuevoUsuario = {
            nombre: user.nombre,
            email: user.email,
            password: hashedPassword
        };

        const usuarioGuardado = await this.#model.register(nuevoUsuario);
        await sendEmail(user.email);

        return jwtToken.generarToken(usuarioGuardado);
    }

    actualizarUser = async (id, user) => {
        const res = validar(user, 'actualizar');
        if (!res.result) throw new Error(`Error: ${res.error.message}`);
        return await this.#model.actualizarUser(id, user);
    }

    borrarUser = async id => {
        const userEliminado = await this.#model.borrarUser(id)
        await this.#modelSounds.borrarSonidosDelUsuario(userEliminado._id);
        return userEliminado
    }
}

export default Servicio
