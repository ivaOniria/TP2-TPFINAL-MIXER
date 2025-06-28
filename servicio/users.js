import usersMongoDB from '../model/DAO/usersMongoDB.js'
import { validar } from './validaciones/users.js'
import { sendEmail } from '../utils/nodemailer.js';
import jwtToken from '../utils/jwtToken.js';
import soundsMongoDB from '../model/DAO/soundsMongoDB.js'

class Servicio {
    #model
    #jwtService

    constructor() {
        this.#model = new usersMongoDB()
        this.#jwtService = new jwtToken()

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
        //const res = validar(user, 'login')
        // if (res.result) {
        return await this.#jwtService.login(user);
        // }
    }

    register = async (user) => {
        const existente = await this.#model.buscarPorEmail(user.email);
        if (existente) {
            throw new Error('El email ya está registrado');
        }

        //const res = validar(user, 'register');
        //if (res.result) {
        const userCreado = await this.#jwtService.register(user);
        await sendEmail(user.email);
        return userCreado;
        //}
    }

    actualizarUser = async (id, user) => {
        const userActualizado = await this.#model.actualizarUser(id, user)
        return userActualizado
    }

    borrarUser = async id => {
        const userEliminado = await this.#model.borrarUser(id)

        // Chequear que funciona
        await soundsMongoDB.updateMany(
            { user: userEliminado._id },
            { $unset: { user: "" } } // O deleateMany()
        );

        return userEliminado
    }

    obtenerEstadisticas = async opcion => {
        const users = await this.#model.obtenerUsers()
        switch (opcion) {
            case 'cantidad':
                return { cantidad: users.length }

            case 'avg-precio':
                return { 'precio promedio': +(users.reduce((acc, p) => acc + p.precio, 0) / users.length).toFixed(2) }

            case 'min-precio':
                return { 'precio mínimo': +Math.min(...users.map(p => p.precio)).toFixed(2) }

            case 'max-precio':
                return { 'precio máximo': +Math.max(...users.map(p => p.precio)).toFixed(2) }

            default:
                return { error: `opción estadistica '${opcion}' no soportada` }
        }
    }
}

export default Servicio