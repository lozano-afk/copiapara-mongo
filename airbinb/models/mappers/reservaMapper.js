import { Reserva } from "../entities/Reserva.js";
import { RangoDeFechas } from "../entities/RangoDeFechas.js";

export const mapDocumentoAReserva = (doc) => {
  const reserva = new Reserva(
    doc.huespedReservador,
    doc.cantHuespedes,
    new RangoDeFechas(doc.rangoFechas.fechaInicio, doc.rangoFechas.fechaFin),
    doc.idAlojamiento
  );

  reserva.id = doc._id.toString();
  reserva.estado = doc.estado;
  reserva.fechaAlta = doc.fechaAlta;
  reserva.motivoCancelacion = doc.motivoCancelacion;
  reserva.canceladaPor = doc.canceladaPor;
  reserva.cambiosEstado = doc.cambiosEstado;

  return reserva;
};
