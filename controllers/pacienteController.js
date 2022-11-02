import Paciente from "../models/paciente.js";

const agregarPaciente = async (req, res) => {

    const paciente = new Paciente(req.body); //Instancia del objeto de paciente
    paciente.veterinario = req.veterinario._id

    try {
        
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);

    } catch (error) {
        console.log(error);
    }


};


const obtenerPacientes = async (req, res) => {

    const paciente = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(paciente);

};

const obtenerPaciente = async (req, res) => {

    const { id } = req.params;
    const paciente = await Paciente.findById(id);
    
    console.log(paciente.veterinario._id);
    console.log(req.veterinario._id);

    if(!paciente) {
        
        return res.status(404).json({ msg: "No encontrado"});
 
     }


//Toca colocarle tostring para que no valide por el object id, esto es para mongodb 
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {

        res.json({ msg: "Accion no valida"});

    }

    if(paciente) {
        res.json(paciente);
    } 

};

const actualizarPaciente = async (req, res) => {

    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        
       return res.status(404).json({ msg: "No encontrado"});

    }

//Toca colocarle tostring para que no valide por el object id, esto es para mongodb 
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {

        res.json({ msg: "Accion no valida"});

    }

    //Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;


    try {

        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);

    } catch (error) {
        console.log(error);
    }



};

const eliminarPaciente = async (req, res) => {

    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        
       return res.status(404).json({ msg: "No encontrado"});

    }

//Toca colocarle tostring para que no valide por el object id, esto es para mongodb 
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {

        res.json({ msg: "Accion no valida"});

    }

    //Elimina el paciente

    try {
        await paciente.deleteOne();
        res.json({ msg: "Paciente Eliminado"});
    } catch (error) {
        console.log(error);
    }


};


export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}