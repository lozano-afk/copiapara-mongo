import mongoose from "mongoose";
import { EstadoReserva } from "../entities/EstadoReserva.js";

export const cambioEstadoReservaSchema = new mongoose.Schema(
  {
    estadoReserva: {
      type: String,
      enum: [
        EstadoReserva.PENDIENTE,
        EstadoReserva.CONFIRMADA,
        EstadoReserva.CANCELADA,
      ],
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    motivo: {
      type: String,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { _id: false }
);
