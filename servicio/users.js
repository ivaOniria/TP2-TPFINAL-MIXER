import ModelMongoDB from '../model/DAO/samplesMongoDB.js'
import { validar } from './validaciones/users.js'


class Servicio {
    #model

    constructor() {
        this.#model = new ModelMongoDB()
    }

    obtenerUsuarios = async id => {
        if(id) {
            const usuario = await this.#model.obtenerUsuario(id)
            return usuario
        }
        else {
            const usuarios = await this.#model.obtenerUsuarios()
            return usuarios
        }
    }

    guardarUsuario = async Usuario => {
        const res = validar(Usuario)
        if(res.result) {
            const usuarioGuardado = await this.#model.guardarUsuario(Usuario)
            return usuarioGuardado
        }
        else {
            throw new Error(res.error.details[0].message)
        }
    }

    actualizarUsuario = async (id,Usuario) => {
        const usuarioActualizado = await this.#model.actualizarUsuario(id,Usuario)
        return usuarioActualizado
    }

    borrarUsuario = async id => {
        const usuarioEliminado = await this.#model.borrarUsuario(id)
        return usuarioEliminado
    }

    obtenerEstadisticas = async opcion => {
        const usuarios = await this.#model.obtenerUsuarios()
        switch(opcion) {
            case 'cantidad':
                return { cantidad: usuarios.length }

            case 'avg-precio':
                return { 'precio promedio': +(usuarios.reduce((acc,p) => acc + p.precio, 0) / usuarios.length).toFixed(2) }

            case 'min-precio':
                return { 'precio mínimo': +Math.min(...usuarios.map(p => p.precio)).toFixed(2) }

            case 'max-precio':
                return { 'precio máximo': +Math.max(...usuarios.map(p => p.precio)).toFixed(2) }

            default:
                return { error: `opción estadistica '${opcion}' no soportada` }
        }
    }
}

export default Servicio