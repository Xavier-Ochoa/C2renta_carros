import { Schema, model } from 'mongoose';

const clienteSchema = new Schema(
  {
    cedula: {
      type: String,
      required: [true, 'La cédula es obligatoria'],
      unique: true,
      trim: true,
    },
    nombres: {
      type: String,
      required: [true, 'Los nombres son obligatorios'],
      trim: true,
    },
    apellidos: {
      type: String,
      required: [true, 'Los apellidos son obligatorios'],
      trim: true,
    },
    ciudad: {
      type: String,
      required: [true, 'La ciudad es obligatoria'],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    direccion: {
      type: String,
      trim: true,
      default: null,
    },
    fecha_nacimiento: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Cliente', clienteSchema);
