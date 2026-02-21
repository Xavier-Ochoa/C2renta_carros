import Vehiculo from '../models/Vehiculo.js';

// ===== CRUD VEHÍCULOS =====

/**
 * Listar todos los vehículos
 * GET /vehiculos
 */
const listarVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find().select('-__v');

    res.status(200).json({
      msg: 'Vehículos listados correctamente',
      total: vehiculos.length,
      vehiculos
    });
  } catch (error) {
    console.error('Error al listar vehículos:', error.message);
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

/**
 * Obtener detalle de un vehículo
 * GET /vehiculos/:id
 */
const detalleVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de vehículo inválido' });
    }

    const vehiculo = await Vehiculo.findById(id).select('-__v');

    if (!vehiculo) {
      return res.status(404).json({ msg: 'Vehículo no encontrado' });
    }

    res.status(200).json({ msg: 'Vehículo encontrado', vehiculo });
  } catch (error) {
    console.error('Error al obtener vehículo:', error.message);
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

/**
 * Crear un nuevo vehículo
 * POST /vehiculos
 */
const crearVehiculo = async (req, res) => {
  try {
    const { marca, modelo, anio_fabricacion, placa, color, tipo_vehiculo, kilometraje } = req.body;

    // Validar campos obligatorios
    const camposObligatorios = ['marca', 'modelo', 'anio_fabricacion', 'placa', 'color', 'tipo_vehiculo'];
    const camposFaltantes = camposObligatorios.filter(campo => !req.body[campo]);

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        msg: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
      });
    }

    // Verificar placa duplicada
    const placaExistente = await Vehiculo.findOne({ placa: placa.trim().toUpperCase() });
    if (placaExistente) {
      return res.status(400).json({ msg: 'Ya existe un vehículo con esta placa' });
    }

    // Validar año
    const anioActual = new Date().getFullYear();
    if (anio_fabricacion < 1900 || anio_fabricacion > anioActual + 1) {
      return res.status(400).json({ msg: `El año de fabricación debe estar entre 1900 y ${anioActual + 1}` });
    }

    const nuevoVehiculo = new Vehiculo({
      ...req.body,
      placa: placa.trim().toUpperCase()
    });
    await nuevoVehiculo.save();

    res.status(201).json({
      msg: 'Vehículo creado correctamente',
      vehiculo: nuevoVehiculo
    });

  } catch (error) {
    console.error('Error al crear vehículo:', error.message);

    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ msg: 'Error de validación', errores: mensajes });
    }

    if (error.code === 11000) {
      const campo = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ msg: `Ya existe un registro con este ${campo}` });
    }

    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

/**
 * Actualizar un vehículo
 * PUT /vehiculos/:id
 */
const actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de vehículo inválido' });
    }

    if (Object.keys(actualizaciones).length === 0) {
      return res.status(400).json({ msg: 'Debes enviar al menos un campo para actualizar' });
    }

    // Si se actualiza la placa, verificar que no exista otra igual
    if (actualizaciones.placa) {
      actualizaciones.placa = actualizaciones.placa.trim().toUpperCase();
      const placaExistente = await Vehiculo.findOne({
        placa: actualizaciones.placa,
        _id: { $ne: id }
      });
      if (placaExistente) {
        return res.status(400).json({ msg: 'Ya existe otro vehículo con esta placa' });
      }
    }

    const vehiculo = await Vehiculo.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!vehiculo) {
      return res.status(404).json({ msg: 'Vehículo no encontrado' });
    }

    res.status(200).json({ msg: 'Vehículo actualizado correctamente', vehiculo });

  } catch (error) {
    console.error('Error al actualizar vehículo:', error.message);

    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ msg: 'Error de validación', errores: mensajes });
    }

    if (error.code === 11000) {
      const campo = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ msg: `Ya existe un registro con este ${campo}` });
    }

    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

/**
 * Eliminar un vehículo
 * DELETE /vehiculos/:id
 */
const eliminarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de vehículo inválido' });
    }

    const vehiculo = await Vehiculo.findByIdAndDelete(id).select('-__v');

    if (!vehiculo) {
      return res.status(404).json({ msg: 'Vehículo no encontrado' });
    }

    res.status(200).json({ msg: 'Vehículo eliminado correctamente', vehiculo });

  } catch (error) {
    console.error('Error al eliminar vehículo:', error.message);
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

export {
  listarVehiculos,
  detalleVehiculo,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
};
