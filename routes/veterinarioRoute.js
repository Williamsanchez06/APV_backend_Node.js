import express  from "express";

const router = express.Router();

import{ registrar, perfil, confirmar, autenticar, olvidePassword,comprobarToken,
    nuevoPassword, actualizarPerfil, actualizarPassword
} 
from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

//Are a publica
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password',olvidePassword);
// router.get('/olvide-password/:token',comprobarToken);
// router.post('/olvide-password/:token',nuevoPassword);

//Me ahorro codigo esto se puede hacer en express
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//Area Privada
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;