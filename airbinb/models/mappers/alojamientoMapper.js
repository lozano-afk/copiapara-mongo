import { Alojamiento } from "../entities/Alojamiento.js";

export const mapDocumentoAAlojamiento = (doc) => {
  const alojamiento = new Alojamiento(
    doc._id.toString(),
    doc.nombre,
    doc.descripcion,
    doc.precioPorNoche,
    doc.moneda,
    doc.horarioCheckIn,
    doc.horarioCheckOut,
    doc.direccion,
    doc.cantHuespedesMax,
    doc.anfitrion,
    doc.caracteristicas,
    doc.fotos
  );
  return alojamiento;
};
