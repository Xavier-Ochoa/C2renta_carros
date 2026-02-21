import Cliente from '../models/Cliente.js';

// ===== CRUD CLIENTES =====

/**
 * Listar todos los clientes
 * GET /clientes
 */
const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().select('-__v');

    res.status(200).json({
      msg: 'Clientes listados correctamente',
      total: clientes.length,
      clientes
    });
  } catch (error) {
    console.error('Error al listar clientes:', error.message);
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

/**
 * Obtener detalle de un cliente
 * GET /clientes/:id
 */
const detalleCliente = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de cliente inválido' });
    }

    const cliente = await Cliente.findById(id).select('-__v');

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    res.status(200).json({ msg: 'Cliente encontrado', cliente });
  } catch (error) {
    console.error('Error al obtener cliente:', error.message);
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

/**
 * Crear un nuevo cliente
 * POST /clientes
 */
const crearCliente = async (req, res) => {
  try {
    const { cedula, nombres, apellidos, ciudad, telefono, email } = req.body;

    // Validar campos obligatorios
    const camposObligatorios = ['cedula', 'nombres', 'apellidos', 'ciudad', 'telefono', 'email'];
    const camposFaltantes = camposObligatorios.filter(campo => !req.body[campo]);

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        msg: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
      });
    }

    // Verificar cédula duplicada
    const cedulaExistente = await Cliente.findOne({ cedula: cedula.trim() });
    if (cedulaExistente) {
      return res.status(400).json({ msg: 'Ya existe un cliente con esta cédula' });
    }

    // Verificar email duplicado
    const emailExistente = await Cliente.findOne({ email: email.trim().toLowerCase() });
    if (emailExistente) {
      return res.status(400).json({ msg: 'Ya existe un cliente con este email' });
    }

    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();

    res.status(201).json({
      msg: 'Cliente creado correctamente',
      cliente: nuevoCliente
    });

  } catch (error) {
    console.error('Error al crear cliente:', error.message);

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
 * Actualizar un cliente
 * PUT /clientes/:id
 */
const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de cliente inválido' });
    }

    if (Object.keys(actualizaciones).length === 0) {
      return res.status(400).json({ msg: 'Debes enviar al menos un campo para actualizar' });
    }

    // Si se actualiza la cédula, verificar que no exista otra igual
    if (actualizaciones.cedula) {
      const cedulaExistente = await Cliente.findOne({
        cedula: actualizaciones.cedula.trim(),
        _id: { $ne: id }
      });
      if (cedulaExistente) {
        return res.status(400).json({ msg: 'Ya existe otro cliente con esta cédula' });
      }
    }

    // Si se actualiza el email, verificar que no exista otro igual
    if (actualizaciones.email) {
      const emailExistente = await Cliente.findOne({
        email: actualizaciones.email.trim().toLowerCase(),
        _id: { $ne: id }
      });
      if (emailExistente) {
        return res.status(400).json({ msg: 'Ya existe otro cliente con este email' });
      }
    }

    const cliente = await Cliente.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    res.status(200).json({ msg: 'Cliente actualizado correctamente', cliente });

  } catch (error) {
    console.error('Error al actualizar cliente:', error.message);

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
 * Eliminar un cliente
 * DELETE /clientes/:id
 */
const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'ID de cliente inválido' });
    }

    const cliente = await Cliente.findByIdAndDelete(id).select('-__v');

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    res.status(200).json({ msg: 'Cliente eliminado correctamente', cliente });

  } catch (error) {
    console.error('Error al eliminar cliente:', error.message);
    res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
  }
};

export {
  listarClientes,
  detalleCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};
