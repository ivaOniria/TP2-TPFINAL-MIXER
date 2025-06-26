import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Chequear si es necesario

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USERMAIL_PASSWORD,
  },
});

/**
 * Envía un correo con contenido fijo al destinatario indicado.
 * @param {string} to - Dirección de correo del destinatario
 */
export async function sendEmail(to) {
  try {
    const info = await transporter.sendMail({
      from: process.env.USERMAIL,
      to,
      subject: "Bienvenid@ a nuestro servicio 🎉",
      text: "Gracias por registrarte. Este es un correo automático de confirmación.",
      html: "<h2>¡Gracias por registrarte!</h2><p>Este es un correo automático de confirmación.</p>",
    });

    console.log("Correo enviado a:", to, "ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
}
