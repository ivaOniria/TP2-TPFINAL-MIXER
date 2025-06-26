import Joi from 'joi';

export const validar = (usuario, metodo) => {
    const definiciones = {
        nombre: Joi.string()
            .trim()
            .min(1)
            .invalid(null, '')
            .messages({
                'any.invalid': '"nombre" no puede ser null ni vacío',
                'string.base': '"nombre" debe ser una cadena de texto',
                'string.empty': '"nombre" no puede estar vacío'
            }),

        email: Joi.string()
            .trim()
            .pattern(/.+@.+/)
            .required()
            .messages({
                'string.base': '"email" debe ser un texto',
                'string.empty': '"email" no puede estar vacío',
                'string.pattern.base': '"email" debe contener un @',
                'any.required': '"email" es obligatorio',
            }),

        password: Joi.string()
            .min(6)
            .invalid(null, '')
            .messages({
                'any.invalid': '"contraseña" no puede ser null ni vacía',
                'string.min': '"contraseña" debe tener al menos 6 caracteres'
            })
    };

    let camposRequeridos = [];

    if (metodo === 'register') {
        camposRequeridos = ['nombre', 'email', 'password'];
    } else if (metodo === 'login') {
        camposRequeridos = ['email', 'password'];
    } else {
        return { result: false, error: { message: 'Método no válido' } };
    }

    const esquema = Joi.object(
        Object.fromEntries(
            camposRequeridos.map((campo) => [campo, definiciones[campo].required()])
        )
    );

    const { error } = esquema.validate(usuario, { abortEarly: false });
    return error ? { result: false, error } : { result: true };
};
