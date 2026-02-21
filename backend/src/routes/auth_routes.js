import { Router } from 'express';
import { registro, login, perfil } from '../controllers/auth_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

// Registro de usuario
router.post('/registro', registro);

// Login
router.post('/login', login);

// Perfil (ruta protegida)
router.get('/perfil', verificarTokenJWT, perfil);

export default router;
