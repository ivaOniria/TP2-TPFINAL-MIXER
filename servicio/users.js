import usersMongoDB from '../model/DAO/usersMongoDB.js'
import { validar } from './validaciones/users.js'
import { sendEmail } from '../utils/nodemailer.js';
import jwtToken from '../utils/jwtToken.js';
import soundsMongoDB from '../model/DAO/soundsMongoDB.js'

class Servicio {
    #model
    #jwtService
    #modelSounds

    constructor() {
        this.#model = new usersMongoDB()
        this.#jwtService = new jwtToken()
        this.#modelSounds = new soundsMongoDB()

    }

    obtenerUsers = async id => {
        if (id) {
            const user = await this.#model.obtenerUser(id)
            return user
        }
        else {
            const users = await this.#model.obtenerUsers()
            return users
        }
    }

    guardarUser = async user => {
        const res = validar(user)
        if (res.result) {
            const userGuardado = await this.#model.guardarUser(user)
            return userGuardado
        }
        else {
            throw new Error(res.error.details[0].message)
        }
    }

    login = async (user) => {
        const res = validar(user, 'login');
        console.log(res, "llega la respuesta")
        if (!res.result) {
            const mensaje = res.error.details.map(e => e.message).join(', ');
            throw new Error(`Error de validación: ${mensaje}`);
        }

        return await this.#jwtService.login(user);
    }

    register = async (user) => {

        const res = validar(user, 'register');
        if (!res.result) {
            const mensaje = res.error.message;
            throw new Error(`Error: ${mensaje}`);
        }

        const existente = await this.#model.buscarPorEmail(user.email);
        if (existente) {
            throw new Error('El email ya está registrado');
        }

        const userCreado = await this.#jwtService.register(user);
        await sendEmail(user.email);
        return userCreado;

    }

    actualizarUser = async (id, user) => {
        const userActualizado = await this.#model.actualizarUser(id, user)
        return userActualizado
    }

    borrarUser = async id => {
        const userEliminado = await this.#model.borrarUser(id)
        await this.#modelSounds.borrarSonidosDelUsuario(userEliminado._id);
        return userEliminado
    }
}

export default Servicio