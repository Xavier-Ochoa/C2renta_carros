import { Router } from 'express';
import {
  listarVehiculos,
  detalleVehiculo,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
} from '../controllers/vehiculo_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

// Listar todos los vehículos
router.get('/', verificarTokenJWT, listarVehiculos);

// Detalle de un vehículo
router.get('/:id', verificarTokenJWT, detalleVehiculo);

// Crear vehículo
router.post('/', verificarTokenJWT, crearVehiculo);

// Actualizar vehículo
router.put('/:id', verificarTokenJWT, actualizarVehiculo);

// Eliminar vehículo
router.delete('/:id', verificarTokenJWT, eliminarVehiculo);

export default router;
