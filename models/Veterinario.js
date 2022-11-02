import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const veterinariosSchema = mongoose.Schema({

    nombre: {
        type: String,
        require: true,
        trim: true
    }, 
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    }, 
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {

        type: String,
        default: null,

    }, 
    token: {
        type: String,
        default: generarId(),
    }, 
    confirmado: {
        type: Boolean,
        default: false,
    }

});

//No se puede utilizar arrow funcitons porque no sirve el this trae undefined
veterinariosSchema.pre('save', async function(next) {
    //Si ya esta hasheado no ejecuta la siguiente linea 
    if(!this.isModified('password')){
        next();
    }  

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);

})


veterinariosSchema.methods.comprobarPassword = async function(passwordFormulario) {

    return await bcrypt.compare(passwordFormulario, this.password);

}


const Veterinario = mongoose.model("Veterinario", veterinariosSchema);

export default Veterinario;