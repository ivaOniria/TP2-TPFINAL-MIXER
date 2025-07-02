import Joi from 'joi';

export const validar = (sonido, method) => {
  const esPost = method === 'POST';

  const definiciones = {
    title: Joi.string().invalid(null, '').messages({
      'any.invalid': '"title" no puede ser null ni vacío',
      'string.base': '"title" debe ser una cadena de texto',
    }),
    url: Joi.string().uri().invalid(null, '').messages({
      'any.invalid': '"url" no puede ser null ni vacío',
      'string.uri': '"url" debe ser una URL válida',
    }),
    type: Joi.string().invalid(null, '').messages({
      'any.invalid': '"type" no puede ser null ni vacío',
      'string.base': '"type" debe ser una cadena de texto',
    }),
    user: Joi.object({
      _id: Joi.string()
        .length(24)
        .hex()
        .messages({
          'string.length': '"user._id" debe tener 24 caracteres',
          'string.hex': '"user._id" debe ser un ObjectId válido',
          'any.required': '"user._id" es obligatorio',
        }),
    })
      .unknown(true)  
      .messages({
        'object.base': '"user" debe ser un objeto con campo "_id"',
        'any.required': '"user" es obligatorio',
      }),
  };

  if (esPost) {
    for (const campo in definiciones) {
      definiciones[campo] = definiciones[campo].required();
    }
  }

  const schema = Joi.object(definiciones).min(esPost ? 0 : 1);
  const { error } = schema.validate(sonido);
  return error ? { result: false, error } : { result: true };
};
