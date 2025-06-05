import Joi from 'joi'
import { TIPOS_DE_SONIDO_ARRAY } from '../../src/constantes/tiposDeSonido.js'

export const validar = (sample, method) => {
    const esPost = method === 'POST'

    const definiciones = {
        nombre: Joi.string().invalid(null, '').messages({
            'any.invalid': '"nombre" no puede ser null ni vacío',
            'string.base': '"nombre" debe ser una cadena de texto'
        }),
        url: Joi.string().uri().invalid(null, '').messages({
            'any.invalid': '"url" no puede ser null ni vacío',
            'string.uri': '"url" debe ser una URL válida'
        }),
        tipo: Joi.string().valid(...TIPOS_DE_SONIDO_ARRAY).invalid(null, '').messages({
            'any.only': `"tipo" debe ser uno de: ${TIPOS_DE_SONIDO_ARRAY.join(', ')}`,
            'any.invalid': '"tipo" no puede ser null ni vacío'
        })
    }

    if (esPost) {
        for (const campo in definiciones) {
            definiciones[campo] = definiciones[campo].required()
        }
    }

    const schema = Joi.object(definiciones).min(esPost ? 0 : 1)
    const { error } = schema.validate(sample)
    return error ? { result: false, error } : { result: true }
}

