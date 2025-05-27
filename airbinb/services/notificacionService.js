import { Notificacion } from '../models/entities/Notificacion.js';
import { ValidationError, NotFoundError } from "../errors/appError.js";

export class NotificacionService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    const notificaciones = await this.repository.findAll();
    return notificaciones.map(n => this.toDTO(n));
  }

  async findByUsuario(usuarioId) {
    if (!usuarioId) {
      throw new ValidationError("El ID de usuario es requerido");
    }
    const notificaciones = await this.repository.findByUsuario(usuarioId);
    return notificaciones.map(n => this.toDTO(n));
  }

  async findNoLeidas(usuarioId) {
    if (!usuarioId) {
      throw new ValidationError("El ID de usuario es requerido");
    }
    const notificaciones = await this.repository.findNoLeidas(usuarioId);
    return notificaciones.map(n => this.toDTO(n));
  }

  async marcarComoLeida(id) {
    if (!id) {
      throw new ValidationError("El ID de notificación es requerido");
    }

    const notificacion = await this.repository.findById(id);
    if (!notificacion) {
      throw new NotFoundError(`No se encontró la notificación con ID ${id}`);
    }

    notificacion.marcarComoLeida();
    await this.repository.save(notificacion);
    return this.toDTO(notificacion);
  }

  async marcarTodasComoLeidas(usuarioId) {
    if (!usuarioId) {
      throw new ValidationError("El ID de usuario es requerido");
    }

    const notificaciones = await this.repository.marcarTodasComoLeidas(usuarioId);
    return notificaciones.map(n => this.toDTO(n));
  }

  async crear(mensaje, usuario, reserva) {
    const notificacion = new Notificacion(mensaje, usuario, reserva);
    await this.repository.save(notificacion);
    return this.toDTO(notificacion);
  }

  toDTO(notificacion) {
    return {
      id: notificacion.id,
      mensaje: notificacion.mensaje,
      usuario: notificacion.usuario?.mail ?? null,
      reserva: notificacion.reserva?.id,
      fechaCreacion: notificacion.fechaCreacion,
      leida: notificacion.leida,
      fechaLeida: notificacion.fechaLeida,
    };
  }

}
