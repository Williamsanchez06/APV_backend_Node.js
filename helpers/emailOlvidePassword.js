import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {

    const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
        }
      });

     const { email, nombre , token } = datos;

      //Enviar email 
      const info = await transporter.sendMail({

        from: 'APV -Administrados de pacientes de Veterinaria',
        to: email,
        subject: 'Restablece tu Password',
        text: 'Restablece tu Password',
        html: `<p>Hola: ${nombre},Has solcitado Restablecer tu Password.</p>
              <p>Sigue el siguiente enlace para generar un nuevo Password:
              <p>Tu cuenta ya esta lista solo debes comprobarla en el siguiente enlace:
              <a href="${process.env.FRONTEND_URL}/frontend/NuevoPassword.html?token=${token}">Restablecer Password</a></p>

              <p>Si tu no creastes la cuenta puedes ignorar este mensaje</p>
        `

      })

      console.log("Mensaje Enviado: %s", info.messageId);

}

export default emailOlvidePassword;