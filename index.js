import  express  from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoute from "./routes/veterinarioRoute.js";
import pacienteRoute from "./routes/pacienteRoute.js";


const app = express();
app.use(express.json()); //Para que es expreses obtenga datos tipo json

dotenv.config(); //Para buscar el archivo .env 

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            //El origen del request esta permitido 
            callback(null,true);
        } else {
                callback(new Error('No permitido por CORS'));
        }
    }
}

app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRoute);
app.use('/api/pacientes', pacienteRoute);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=> {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});