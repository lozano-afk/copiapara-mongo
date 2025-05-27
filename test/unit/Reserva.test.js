import { Usuario } from "../../airbinb/models/entities/Usuario.js";
import { TipoUsuario } from "../../airbinb/models/entities/TipoUsuario.js";
import { RangoDeFechas } from "../../airbinb/models/entities/RangoDeFechas.js";
import { Reserva } from "../../airbinb/models/entities/Reserva.js";
import { EstadoReserva } from "../../airbinb/models/entities/EstadoReserva.js";

describe("Reserva", () => {
  const usuario = new Usuario("Tomas", "tomas@huesped", TipoUsuario.HUESPED);
  const rango = new RangoDeFechas(
    new Date("2020-20-20"),
    new Date("2020-20-22")
  );
  const reserva = new Reserva(usuario, 2, rango, 100);

  test("se deben guardar los atributos correctamente", () => {
    expect(reserva.cantHuespedes).toBe(2);
    expect(reserva.estado).toBe(EstadoReserva.PENDIENTE);
    /*expect(reserva.fechaAlta).toStrictEqual(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      )
    );*/
    expect(reserva.huespedReservador).toStrictEqual(usuario);
    //expect(reserva.precioPornoche).toBe(100);
    expect(reserva.rangoFechas).toStrictEqual(rango);
  });

  test("actualizarEstado", () => {
    reserva.actualizarEstado(EstadoReserva.CANCELADA);
    expect(reserva.estado).toBe(EstadoReserva.CANCELADA);
    reserva.actualizarEstado(EstadoReserva.CONFIRMADA);
    expect(reserva.estado).toBe(EstadoReserva.CONFIRMADA);
  });
});
