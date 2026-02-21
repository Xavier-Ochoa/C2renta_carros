import { Schema, model } from 'mongoose';

const vehiculoSchema = new Schema(
  {
    marca: {
      type: String,
      required: [true, 'La marca es obligatoria'],
      trim: true,
    },
    modelo: {
      type: String,
      required: [true, 'El modelo es obligatorio'],
      trim: true,
    },
    anio_fabricacion: {
      type: Number,
      required: [true, 'El año de fabricación es obligatorio'],
    },
    placa: {
      type: String,
      required: [true, 'La placa es obligatoria'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    color: {
      type: String,
      required: [true, 'El color es obligatorio'],
      trim: true,
    },
    tipo_vehiculo: {
      type: String,
      required: [true, 'El tipo de vehículo es obligatorio'],
      enum: ['sedan', 'SUV', 'camioneta', 'deportivo', 'van', 'otro'],
      trim: true,
    },
    kilometraje: {
      type: Number,
      required: [true, 'El kilometraje es obligatorio'],
      default: 0,
    },
    descripcion: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Vehiculo', vehiculoSchema);
