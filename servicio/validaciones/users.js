import Joi from 'joi';

export const validar = (usuario, metodo) => {
    const definiciones = {
        nombre: Joi.string()
            .trim()
            .min(1)
            .invalid(null, '')
            .messages({
                'any.invalid': 'El campo "nombre" no puede ser null',
                'string.base': 'El campo "nombre" debe ser una cadena de texto',
                'string.empty': 'El campo "nombre" no puede estar vacío'
            }),

        email: Joi.string()
            .trim()
            .pattern(/.+@.+/)
            .required()
            .messages({
                'string.base': 'El campo "email" debe ser un texto',
                'string.empty': 'El campo "email" no puede estar vacío',
                'string.pattern.base': 'El campo "email" debe contener un @',
                'any.required': 'El campo "email" es obligatorio',
            }),

        password: Joi.string()
            .min(6)
            .invalid(null, '')
            .messages({
                'any.invalid': 'El campo "contraseña" no puede ser null',
                'string.empty': 'El campo "contraseña" no puede estar vacío',
                'string.min': 'El campo "contraseña" debe tener al menos 6 caracteres'
            })
    };

    let camposRequeridos = [];

    let esquema;

    if (metodo === 'register') {
        camposRequeridos = ['nombre', 'email', 'password'];
        esquema = Joi.object(
            Object.fromEntries(
                camposRequeridos.map((campo) => [campo, definiciones[campo].required()])
            )
        );
    } else if (metodo === 'login') {
        camposRequeridos = ['email', 'password'];
        esquema = Joi.object(
            Object.fromEntries(
                camposRequeridos.map((campo) => [campo, definiciones[campo].required()])
            )
        );
    } else if (metodo === 'actualizar') {
        // Para actualizar, todos los campos son opcionales pero mantienen sus validaciones de formato
        esquema = Joi.object({
            nombre: definiciones.nombre.optional(),
            email: definiciones.email.optional(),
            password: definiciones.password.optional()
        });
    } else {
        return { result: false, error: { message: 'Método no válido' } };
    }

    const { error } = esquema.validate(usuario, { abortEarly: false });
    return error ? { result: false, error } : { result: true };
};
