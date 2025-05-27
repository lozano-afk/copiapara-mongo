import { EstadoReserva } from "./EstadoReserva.js";
import { FactoryNotificacion } from "./FactoryNotificacion.js";

export class Alojamiento {
  constructor(
    idAlojamiento, // para evitar la referencia circular Alojamiento -> Reserva -> Alojamiento
    nombre,
    descripcion,
    precioPorNoche,
    moneda,
    horarioCheckIn,
    horarioCheckOut,
    direccion,
    cantHuespedesMax,
    anfitrion,
    caracteristicas,
    fotos
  ) {
    this.idAlojamiento = idAlojamiento; // para evitar la referencia circular Alojamiento -> Reserva -> Alojamiento
    this.anfitrion = anfitrion;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioPorNoche = precioPorNoche;
    this.moneda = moneda;
    this.horarioCheckIn = horarioCheckIn;
    this.horarioCheckOut = horarioCheckOut;
    this.direccion = direccion;
    this.cantHuespedesMax = cantHuespedesMax;
    this.caracteristicas = caracteristicas;
    this.reservas = [];
    this.fotos = fotos;
  }

  tuPrecioEstaDentroDe(valorMinimo, valorMaximo) {
    if (valorMinimo < 0 || valorMaximo < 0) {
      throw RangeError("El precio no puede ser negativo.");
    } else {
      return (
        this.precioPorNoche >= valorMinimo && this.precioPorNoche <= valorMaximo
      );
    }
  }

  tenesCaracteristica(caracteristica) {
    return this.caracteristicas.includes(caracteristica);
  }

  puedenAlojarse(cantHuespedes) {
    if (cantHuespedes < 0) {
      throw new RangeError("La cantidad de huéspedes debe ser mayor a 0");
    } else {
      return cantHuespedes <= this.cantHuespedesMax;
    }
  }

  estasDisponibleEn(rangoFechas) {
    let diasAConsultar = rangoFechas.listaDeDias();
    let diasReservados = this.reservas.flatMap((reserva) =>
      reserva.rangoFechas.listaDeDias()
    );

    //por como maneja javascript las Date() es necesario convertirlas a string para poder compararlas
    diasAConsultar = diasAConsultar.map((d) => d.toDateString());
    diasReservados = diasReservados.map((d) => d.toDateString());

    return !diasAConsultar.some((dia) => diasReservados.includes(dia));
  }

  aceptarReserva(reserva) {
    if (!this.estasDisponibleEn(reserva.rangoFechas)) {
      throw new Error("El alojamiento no está disponible en esas fechas.");
    }
    reserva.actualizarEstado(EstadoReserva.CONFIRMADA);
    this.reservas.push(reserva);
    const notificacion = FactoryNotificacion.crearSegunReserva(
      reserva,
      this.nombre + " aceptó su reserva"
    );
  }

 cancelarReserva(reserva, motivo = null) {
    if (!this.reservas.includes(reserva)) {
      console.log(reserva);
      console.error("La reserva no pertenece a este alojamiento.");
      throw new Error("La reserva no pertenece a este alojamiento.");
    }

    reserva.actualizarEstado(EstadoReserva.CANCELADA);

    const notificacion = FactoryNotificacion.crearSegunReserva(
      reserva,
      this.nombre + " rechazó su reserva"
    );
  }

}
