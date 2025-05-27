import mongoose from "mongoose";

const alojamientoSchema = new mongoose.Schema(
  {
    idAlojamiento: {
      type: Number,
    },
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precioPorNoche: {
      type: Number,
      required: true,
    },
    moneda: {
      type: String,
      required: true,
    },
    horarioCheckIn: {
      type: String,
      required: true,
    },
    horarioCheckOut: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    cantHuespedesMax: {
      type: Number,
      required: true,
    },
    anfitrion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    caracteristicas: {
      type: [String],
    },
    fotos: {
      type: [String],
    },
  },
  {
    timestamps: true,
    collection: "Alojamientos",
  }
);

export const ModeloAlojamiento = mongoose.model(
  "Alojamiento",
  alojamientoSchema
);
