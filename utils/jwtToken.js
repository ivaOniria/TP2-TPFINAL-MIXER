import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class jwtToken {

    // Compara la contraseña con el hash
    static async verificarPassword(passwordPlano, hash) {
        return await bcrypt.compare(passwordPlano, hash);
    }

    // Genera un hash para una contraseña
    static async hashearPassword(passwordPlano) {
        const saltRounds = 10;
        return await bcrypt.hash(passwordPlano, saltRounds);
    }

    // Genera un JWT con datos del usuario
    static generarToken(usuario) {
        const payload = {
            id: usuario._id,
            email: usuario.email
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            access_token: token,
            expires_in: 3600,
            user: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
            }
        };
    }
}

export default jwtToken;
