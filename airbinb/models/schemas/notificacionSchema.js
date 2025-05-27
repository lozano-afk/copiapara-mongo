import mongoose from "mongoose";

export const notificacionSchema = new mongoose.Schema(
  {
    mensaje: {
      type: String,
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    reserva: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reserva",
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    leida: {
      type: Boolean,
      default: false,
    },
    fechaLeida: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
