import { Schema, model } from 'mongoose';

const reservaSchema = new Schema(
  {
    codigo: {
      type: String,
      required: [true, 'El código de reserva es obligatorio'],
      unique: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: null,
    },
    id_cliente: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El ID del cliente es obligatorio'],
    },
    id_vehiculo: {
      type: Schema.Types.ObjectId,
      ref: 'Vehiculo',
      required: [true, 'El ID del vehículo es obligatorio'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default model('Reserva', reservaSchema);
