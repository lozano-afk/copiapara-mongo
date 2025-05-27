import { mapDocumentoAAlojamiento } from "../mappers/alojamientoMapper.js";
import { ModeloAlojamiento } from "../schemas/alojamientoSchema.js";

export class AlojamientoRepository {
  async save(alojamiento) {
    const doc = new ModeloAlojamiento({
      nombre: alojamiento.nombre,
      descripcion: alojamiento.descripcion,
      precioPorNoche: alojamiento.precioPorNoche,
      moneda: alojamiento.moneda,
      horarioCheckIn: alojamiento.horarioCheckIn,
      horarioCheckOut: alojamiento.horarioCheckOut,
      direccion: alojamiento.direccion,
      cantHuespedesMax: alojamiento.cantHuespedesMax,
      anfitrion: alojamiento.anfitrion._id || alojamiento.anfitrion, // referencia
      caracteristicas: alojamiento.caracteristicas,
      fotos: alojamiento.fotos,
    });

    const saved = await doc.save();
    alojamiento.idAlojamiento = saved._id.toString();
    return alojamiento;
  }

  async findAll() {
    const docs = await ModeloAlojamiento.find().populate("anfitrion");
    return docs.map((doc) => mapDocumentoAAlojamiento(doc));
  }

  async findById(id) {
    const doc = await ModeloAlojamiento.findById(id).populate("anfitrion");
    return doc ? mapDocumentoAAlojamiento(doc) : null;
  }

  async findByName(nombre) {
    const doc = await ModeloAlojamiento.findOne({ nombre }).populate(
      "anfitrion"
    );
    return doc ? mapDocumentoAAlojamiento(doc) : null;
  }

  async deleteById(id) {
    const result = await ModeloAlojamiento.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async findByNombreYAnfitrion(nombre, anfitrionEmail) {
    const doc = await ModeloAlojamiento.findOne({ nombre }).populate(
      "anfitrion"
    );

    return doc && doc.anfitrion.email === anfitrionEmail
      ? mapDocumentoAAlojamiento(doc)
      : null;
  }

  async findDisponibles(rangoFechas, cantHuespedes) {
    const docs = await ModeloAlojamiento.find().populate("anfitrion");
    const modelos = docs.map((doc) => mapDocumentoAAlojamiento(doc));
    return modelos.filter(
      (a) => a.estasDisponibleEn(rangoFechas) && a.puedenAlojarse(cantHuespedes)
    );
  }

  async findByPrecioEntre(min, max) {
    const docs = await ModeloAlojamiento.find({
      precioPorNoche: { $gte: min, $lte: max },
    }).populate("anfitrion");

    return docs.map((doc) => mapDocumentoAAlojamiento(doc));
  }

  async findByCaracteristica(caracteristica) {
    const docs = await ModeloAlojamiento.find({
      caracteristicas: caracteristica,
    }).populate("anfitrion");

    return docs.map((doc) => mapDocumentoAAlojamiento(doc));
  }
}

//   constructor() {
//     this.alojamientos = [];
//     this.nextId = 1;
//   }
//   async save(alojamiento) {
//       alojamiento.idAlojamiento = this.nextId++;
//       this.alojamientos.push(alojamiento);
//       return alojamiento;
//   }
//   async findAll() {
//     return this.alojamientos;
//   }
//   async findById(id) {
//       const numId = typeof id === 'string' ? parseInt(id, 10) : id;
//       return this.alojamientos.find(a => a.idAlojamiento === numId);
//   }
//   async findByName(nombre) {
//       return this.alojamientos.find(a => a.nombre === nombre);
//   }
//    async deleteById(id) {
//       const index = this.alojamientos.findIndex(a => a.id === id);
//       if (index === -1) return false;
//       this.alojamientos.splice(index, 1);
//       return true;
//     }
//   async findByNombreYAnfitrion(nombre, anfitrionEmail) {
//     return this.alojamientos.find(
//       (a) =>
//         a.nombre === nombre &&
//         a.anfitrion?.email === anfitrionEmail
//     );
//   }
//   async findDisponibles(rangoFechas, cantHuespedes) {
//     return this.alojamientos.filter(
//       (a) =>
//         a.estasDisponibleEn(rangoFechas) &&
//         a.puedenAlojarse(cantHuespedes)
//     );
//   }
//  async findByPrecioEntre(min, max) {
//     return this.alojamientos.filter((a) =>
//       a.tuPrecioEstaDentroDe(min, max)
//     );
//   }
//  async findByCaracteristica(caracteristica) {
//     return this.alojamientos.filter((a) =>
//       a.tenesCaracteristica(caracteristica)
//     );
//   }
