import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


const registrar =  async (req, res) => {
    const { email, nombre} = req.body;

    //Prevenir o revisar si un usuario ya esta registrado 
    const existeUsuario = await Veterinario.findOne({ email });

    if(existeUsuario) {
        const error = new Error('Usuario ya Registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save(); //El await no ejecuta el siguienbte codigo hasta quie se alla guardado en la base de datos
        
        //Enviar el Email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json({veterinarioGuardado});


    } catch (error) {
        console.log(error);
    }

};

const perfil =  (req, res) => {

    const  { veterinario } = req;

    res.json({perfil : veterinario});

};

const confirmar = async (req, res) => {

    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token: token});
    
    if(!usuarioConfirmar) {
        const error = new Error('Token no valido')
        return res.status(404).json({ msg: error.message });
    }

    try {

        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        
        res.json({msg: "Usuario confirmado Correctamente!"});

    } catch (error) {
        console.log(error);
    }

    

};


const autenticar = async(req, res) => {

    const { email, password } = req.body;

    const usuario = await Veterinario.findOne({ email });

    if(!usuario) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuairo esta confirmado
    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta no a sido confirmada');
        return res.status(404).json({ msg: error.message });
    }

    //Revisar el pasword si es igual
    if( await usuario.comprobarPassword(password)) {

        //Autenticar
        res.json({token: generarJWT(usuario.id)});

    } else {
        const error = new Error('El password es incorrecto');
        return res.status(404).json({ msg: error.message });
    }

}

const olvidePassword = async (req, res) => {

    const { email } = req.body;
    
    const existeVeterinario = await Veterinario.findOne({email: email});
    console.log(existeVeterinario);
    
    if(!existeVeterinario) {

        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });

    }

    try {
        
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //Enviar Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        });

        res.json({msg : "Hemos enviado un email con las instrucciones"});

    } catch (error) {
        console.log(error);
    }


}

const comprobarToken = async (req, res) => {

    const { token } = req.params; //req.params lee de la url;
    
    const tokenValido = await Veterinario.findOne({ token : token });
    
    if(tokenValido) {
        //El token es valido el usuario existe
        res.json({msg : "Token valido y el usuario existe"});

    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });
    }

}

const nuevoPassword = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token : token });

    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        
        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();
        res.json({ msg: "Password modificado correctamente"});

    } catch (error) {
        console.log(error);
    }


}

const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg:error.message});
    }

    const { email } = req.body;
    if(veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail) {
            const error = new Error('Ese email ya esta en uso');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web || veterinario.web;
        veterinario.telefono = req.body.telefono || veterinario.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {
        console.log(error);
    }

}

const actualizarPassword = async(req, res) => {

    //Leer datos 
    const { id } = req.veterinario;
    const { pwd_actual , pwd_nuevo } = req.body;

    //Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg:error.message});
    }

    //Comprobar su password 
    if(await veterinario.comprobarPassword(pwd_actual)) {
        
        //Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();

        res.json({msg: 'Password Almacenado correctamente'})

    } else {
        const error = new Error('Password Actual Incorrecto');
        return res.status(400).json({ msg: error.message });
    }


    

}



export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword, 
    actualizarPerfil,
    actualizarPassword
}