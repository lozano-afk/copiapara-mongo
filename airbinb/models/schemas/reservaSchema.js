import mongoose from "mongoose";
import { EstadoReserva } from "../entities/EstadoReserva.js";
import { cambioEstadoReservaSchema } from "./cambioEstadoReservaSchema.js";

const reservaSchema = new mongoose.Schema(
  {
    huespedReservador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    cantHuespedes: {
      type: Number,
      required: true,
    },
    idAlojamiento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alojamiento",
      required: true,
    },
    rangoFechas: {
      fechaInicio: { type: Date, required: true },
      fechaFin: { type: Date, required: true },
    },
    fechaAlta: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: [
        EstadoReserva.PENDIENTE,
        EstadoReserva.CONFIRMADA,
        EstadoReserva.CANCELADA,
      ],
      default: EstadoReserva.PENDIENTE,
    },
    motivoCancelacion: {
      type: String,
    },
    canceladaPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    cambiosEstado: [cambioEstadoReservaSchema],
  },
  {
    timestamps: true,
    collection: "Reservas",
  }
);

export const ModeloReserva = mongoose.model("Reserva", reservaSchema);
