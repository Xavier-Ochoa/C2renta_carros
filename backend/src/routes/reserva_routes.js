import { Router } from 'express';
import {
  listarReservas,
  detalleReserva,
  crearReserva,
  actualizarReserva,
  eliminarReserva
} from '../controllers/reserva_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

// Listar todas las reservas
router.get('/', verificarTokenJWT, listarReservas);

// Detalle de una reserva
router.get('/:id', verificarTokenJWT, detalleReserva);

// Crear reserva
router.post('/', verificarTokenJWT, crearReserva);

// Actualizar reserva
router.put('/:id', verificarTokenJWT, actualizarReserva);

// Eliminar reserva
router.delete('/:id', verificarTokenJWT, eliminarReserva);

export default router;
