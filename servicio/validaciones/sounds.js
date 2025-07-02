import Joi from 'joi'
import { TIPOS_DE_SONIDO_ARRAY } from '../../src/constantes/tiposDeSonido.js'

export const validar = (sonido, method) => {
    const esPost = method === 'POST'

    const definiciones = {
        title: Joi.string().invalid(null, '').messages({
            'any.invalid': '"title" no puede ser null ni vacío',
            'string.base': '"title" debe ser una cadena de texto'
        }),
        url: Joi.string().uri().invalid(null, '').messages({
            'any.invalid': '"url" no puede ser null ni vacío',
            'string.uri': '"url" debe ser una URL válida'
        }),
        type: Joi.string().valid(...TIPOS_DE_SONIDO_ARRAY).invalid(null, '').messages({
            'any.only': `"type" debe ser uno de: ${TIPOS_DE_SONIDO_ARRAY.join(', ')}`,
            'any.invalid': '"type" no puede ser null ni vacío'
        }),
        user: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).invalid(null, '').messages({
            'any.invalid': '"user" no puede ser null ni vacío',
            'string.pattern.base': '"user" debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)'
        })
    }

    if (esPost) {
        for (const campo in definiciones) {
            definiciones[campo] = definiciones[campo].required()
        }
    }

    const schema = Joi.object(definiciones).min(esPost ? 0 : 1)
    const { error } = schema.validate(sonido)
    return error ? { result: false, error } : { result: true }
}

