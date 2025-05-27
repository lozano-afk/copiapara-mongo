import { Reserva } from "./Reserva.js";
import { TipoUsuario } from "./TipoUsuario.js";
import { FactoryNotificacion } from "./FactoryNotificacion.js";

export class Usuario {
  constructor(nombre, email, tipo) {
    this.nombre = nombre;
    this.email = email;
    this.tipo = tipo;
    this.notificaciones = [];
  }

  realizarReserva(alojamiento, cantHuespedes, rangoFechas) {
    if (this.tipo !== TipoUsuario.HUESPED) {
      throw new Error("Solo los huéspedes pueden realizar reservas.");
    }

    if (!alojamiento.puedenAlojarse(cantHuespedes)) {
      throw new Error("La cantidad de huéspedes excede el máximo permitido.");
    }

    const nuevaReserva = new Reserva(
      this,
      cantHuespedes,
      rangoFechas,
      alojamiento.precioPorNoche
    );

    // Se crea la notificación al anfitrión indicando que se hizo una nueva reserva
    const notificacion = FactoryNotificacion.crearSegunReserva(
      nuevaReserva,
      this.nombre + " solicitó una reserva en " + alojamiento.nombre
    );
    //anfitrion.Recibirnotificacion?
    return nuevaReserva;
  }

  recibirNotificacion(notificacion) {
    this.notificaciones.push(notificacion);
  }
}
