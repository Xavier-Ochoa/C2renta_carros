import { Router } from 'express';
import {
  listarClientes,
  detalleCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../controllers/cliente_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

// Listar todos los clientes
router.get('/', verificarTokenJWT, listarClientes);

// Detalle de un cliente
router.get('/:id', verificarTokenJWT, detalleCliente);

// Crear cliente
router.post('/', verificarTokenJWT, crearCliente);

// Actualizar cliente
router.put('/:id', verificarTokenJWT, actualizarCliente);

// Eliminar cliente
router.delete('/:id', verificarTokenJWT, eliminarCliente);

export default router;
