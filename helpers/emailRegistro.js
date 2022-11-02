import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {

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
        subject: 'Comprubea tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `<p>Hola: ${nombre},Comprueba tu cuenta en APV.</p>
              <p>Tu cuenta ya esta lista solo debes comprobarla en el siguiente enlace:
              <a href="${process.env.FRONTEND_URL}/frontend/ConfirmarCuenta.html?token=${token}">Comprobar Cuenta</a> </p>

              <p>Si tu no creastes la cuenta puedes ignorar este mensaje</p>
        `

      })

      console.log("Mensaje Enviado: %s", info.messageId);


}

export default emailRegistro;