import { ModeloReserva } from "../schemas/reservaSchema.js";
import { mapDocumentoAReserva } from "../mappers/reservaMapper.js";
import { EstadoReserva } from "../entities/EstadoReserva.js";

export class ReservaRepository {
  async findAll() {
    const docs = await ModeloReserva.find()
      .populate("huespedReservador")
      .exec();
    return docs.map(mapDocumentoAReserva);
  }

  async findById(id) {
    const doc = await ModeloReserva.findById(id)
      .populate("huespedReservador")
      .exec();
    return doc ? mapDocumentoAReserva(doc) : null;
  }

  async findByUsuarioId(usuarioEmail) {
    const docs = await ModeloReserva.find()
      .populate({
        path: "huespedReservador",
        match: { email: usuarioEmail },
      })
      .exec();

    return docs
      .filter((doc) => doc.huespedReservador) // descarta si no matcheó con email
      .map(mapDocumentoAReserva);
  }

  async save(reserva) {
    if (reserva.id) {
      await ModeloReserva.findByIdAndUpdate(reserva.id, {
        huespedReservador: reserva.huespedReservador._id,
        cantHuespedes: reserva.cantHuespedes,
        idAlojamiento: reserva.idAlojamiento,
        rangoFechas: {
          fechaInicio: reserva.rangoFechas.fechaInicio,
          fechaFin: reserva.rangoFechas.fechaFin,
        },
        fechaAlta: reserva.fechaAlta,
        estado: reserva.estado,
        motivoCancelacion: reserva.motivoCancelacion,
        canceladaPor: reserva.canceladaPor?._id,
        cambiosEstado: reserva.cambiosEstado,
      });
      return reserva;
    } else {
      const nuevoDoc = await ModeloReserva.create({
        huespedReservador: reserva.huespedReservador._id,
        cantHuespedes: reserva.cantHuespedes,
        idAlojamiento: reserva.idAlojamiento,
        rangoFechas: {
          fechaInicio: reserva.rangoFechas.fechaInicio,
          fechaFin: reserva.rangoFechas.fechaFin,
        },
        fechaAlta: reserva.fechaAlta,
        estado: reserva.estado,
        motivoCancelacion: reserva.motivoCancelacion,
        canceladaPor: reserva.canceladaPor?._id,
        cambiosEstado: reserva.cambiosEstado,
      });

      reserva.id = nuevoDoc._id.toString();
      return reserva;
    }
  }

  async create(reserva) {
    return this.save(reserva);
  }

  async estaDisponible(idAlojamiento, fechaInicio, fechaFin, excluirId = null) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const query = {
      idAlojamiento,
      estado: { $ne: EstadoReserva.CANCELADA },
      ...(excluirId && { _id: { $ne: excluirId } }),
    };

    const reservas = await ModeloReserva.find(query);

    return !reservas.some((r) => {
      const rInicio = new Date(r.rangoFechas.fechaInicio);
      const rFin = new Date(r.rangoFechas.fechaFin);

      return (
        (inicio >= rInicio && inicio < rFin) ||
        (fin > rInicio && fin <= rFin) ||
        (inicio <= rInicio && fin >= rFin)
      );
    });
  }

  async deleteById(id) {
    const result = await ModeloReserva.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
