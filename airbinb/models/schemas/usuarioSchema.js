import mongoose from "mongoose";
import { TipoUsuario } from "../entities/TipoUsuario.js";
import { notificacionSchema } from "./notificacionSchema.js";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    tipo: {
      type: String,
      enum: [TipoUsuario.HUESPED, TipoUsuario.ANFITRION],
      required: true,
    },
    reservas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reserva",
      },
    ],
    notificaciones: [
      {
        type: [notificacionSchema],
      },
    ],
  },
  {
    timestamps: true,
    collection: "Usuarios",
  }
);

export const ModeloUsuario = mongoose.model("Usuario", usuarioSchema);
