import Joi from 'joi'

export const validar = (usuario, method) => {
    const esPost = method === 'POST'

    const definiciones = {
        nombre: Joi.string().invalid(null, '').messages({
            'any.invalid': '"nombre" no puede ser null ni vacío',
            'string.base': '"nombre" debe ser una cadena de texto'
        }),
        apellido: Joi.string().invalid(null, '').messages({
            'any.invalid': '"apellido" no puede ser null ni vacío',
            'string.base': '"apellido" debe ser una cadena de texto'
        }),
        dni: Joi.string().pattern(/^\d{7,9}$/).invalid(null, '').messages({
            'any.invalid': '"dni" no puede ser null ni vacío',
            'string.pattern.base': '"dni" debe contener solo números y tener entre 7 y 9 dígitos'
        }),
        mail: Joi.string().email().invalid(null, '').messages({
            'any.invalid': '"mail" no puede ser null ni vacío',
            'string.email': '"mail" debe ser un email válido'
        }),
        contrasenia: Joi.string().min(6).invalid(null, '').messages({
            'any.invalid': '"contraseña" no puede ser null ni vacía',
            'string.min': '"contraseña" debe tener al menos 6 caracteres'
        })
    }

    if (esPost) {
        for (const campo in definiciones) {
            definiciones[campo] = definiciones[campo].required()
        }
    }

    const schema = Joi.object(definiciones).min(esPost ? 0 : 1)
    const { error } = schema.validate(usuario)
    return error ? { result: false, error } : { result: true }
}

