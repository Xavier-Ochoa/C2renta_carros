import Reserva from '../models/Reserva.js';
import Cliente from '../models/Cliente.js';
import Vehiculo from '../models/Vehiculo.js';

// ===== CRUD RESERVAS =====

/**
 * Listar todas las reservas (con datos de cliente y vehículo)
 * GET /reservas
 */
const listarReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find()
      .populate('id_cliente', '-__v')
      .populate('id_vehiculo', '-__v')
      .select('-__v');

    res.status(200).json({
      msg: 'Reservas listadas correctamente',
      total: reservas.length,
      reservas
    });
  } catch (error) {
    console.error('Error al listar reservas:', error.message);
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

/**
 * Obtener detalle de una reserva
 * GET /reservas/:id
 */
const detalleReserva = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de reserva inválido' });
    }

    const reserva = await Reserva.findById(id)
      .populate('id_cliente', '-__v')
      .populate('id_vehiculo', '-__v')
      .select('-__v');

    if (!reserva) {
      return res.status(404).json({ msg: 'Reserva no encontrada' });
    }

    res.status(200).json({ msg: 'Reserva encontrada', reserva });
  } catch (error) {
    console.error('Error al obtener reserva:', error.message);
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

/**
 * Crear una nueva reserva
 * POST /reservas
 */
const crearReserva = async (req, res) => {
  try {
    const { codigo, id_cliente, id_vehiculo, descripcion } = req.body;

    // Validar campos obligatorios
    const camposObligatorios = ['codigo', 'id_cliente', 'id_vehiculo'];
    const camposFaltantes = camposObligatorios.filter(campo => !req.body[campo]);

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        msg: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
      });
    }

    // Verificar que el código no esté duplicado
    const codigoExistente = await Reserva.findOne({ codigo: codigo.trim() });
    if (codigoExistente) {
      return res.status(400).json({ msg: 'Ya existe una reserva con este código' });
    }

    // Verificar que el cliente existe
    if (!id_cliente.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de cliente inválido' });
    }
    const clienteExiste = await Cliente.findById(id_cliente);
    if (!clienteExiste) {
      return res.status(404).json({ msg: 'El cliente indicado no existe' });
    }

    // Verificar que el vehículo existe
    if (!id_vehiculo.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de vehículo inválido' });
    }
    const vehiculoExiste = await Vehiculo.findById(id_vehiculo);
    if (!vehiculoExiste) {
      return res.status(404).json({ msg: 'El vehículo indicado no existe' });
    }

    const nuevaReserva = new Reserva({
      codigo: codigo.trim(),
      descripcion: descripcion || null,
      id_cliente,
      id_vehiculo
    });
    await nuevaReserva.save();

    // Retornar con datos poblados
    const reservaCompleta = await Reserva.findById(nuevaReserva._id)
      .populate('id_cliente', '-__v')
      .populate('id_vehiculo', '-__v')
      .select('-__v');

    res.status(201).json({
      msg: 'Reserva creada correctamente',
      reserva: reservaCompleta
    });

  } catch (error) {
    console.error('Error al crear reserva:', error.message);

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
 * Actualizar una reserva
 * PUT /reservas/:id
 */
const actualizarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de reserva inválido' });
    }

    if (Object.keys(actualizaciones).length === 0) {
      return res.status(400).json({ msg: 'Debes enviar al menos un campo para actualizar' });
    }

    // Si se actualiza el código, verificar que no exista otro igual
    if (actualizaciones.codigo) {
      const codigoExistente = await Reserva.findOne({
        codigo: actualizaciones.codigo.trim(),
        _id: { $ne: id }
      });
      if (codigoExistente) {
        return res.status(400).json({ msg: 'Ya existe otra reserva con este código' });
      }
      actualizaciones.codigo = actualizaciones.codigo.trim();
    }

    // Si se actualiza el cliente, verificar que existe
    if (actualizaciones.id_cliente) {
      if (!actualizaciones.id_cliente.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: 'ID de cliente inválido' });
      }
      const clienteExiste = await Cliente.findById(actualizaciones.id_cliente);
      if (!clienteExiste) {
        return res.status(404).json({ msg: 'El cliente indicado no existe' });
      }
    }

    // Si se actualiza el vehículo, verificar que existe
    if (actualizaciones.id_vehiculo) {
      if (!actualizaciones.id_vehiculo.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ msg: 'ID de vehículo inválido' });
      }
      const vehiculoExiste = await Vehiculo.findById(actualizaciones.id_vehiculo);
      if (!vehiculoExiste) {
        return res.status(404).json({ msg: 'El vehículo indicado no existe' });
      }
    }

    const reserva = await Reserva.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    )
      .populate('id_cliente', '-__v')
      .populate('id_vehiculo', '-__v')
      .select('-__v');

    if (!reserva) {
      return res.status(404).json({ msg: 'Reserva no encontrada' });
    }

    res.status(200).json({ msg: 'Reserva actualizada correctamente', reserva });

  } catch (error) {
    console.error('Error al actualizar reserva:', error.message);

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
 * Eliminar una reserva
 * DELETE /reservas/:id
 */
const eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de reserva inválido' });
    }

    const reserva = await Reserva.findByIdAndDelete(id)
      .populate('id_cliente', '-__v')
      .populate('id_vehiculo', '-__v')
      .select('-__v');

    if (!reserva) {
      return res.status(404).json({ msg: 'Reserva no encontrada' });
    }

    res.status(200).json({ msg: 'Reserva eliminada correctamente', reserva });

  } catch (error) {
    console.error('Error al eliminar reserva:', error.message);
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

export {
  listarReservas,
  detalleReserva,
  crearReserva,
  actualizarReserva,
  eliminarReserva
};
