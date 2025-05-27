import { Alojamiento } from "../../airbinb/models/entities/Alojamiento.js";
import { Moneda } from "../../airbinb/models/entities/Moneda.js";
import { Direccion } from "../../airbinb/models/entities/Direccion.js";
import { Ciudad } from "../../airbinb/models/entities/Ciudad.js";
import { Pais } from "../../airbinb/models/entities/Pais.js";
import { Usuario } from "../../airbinb/models/entities/Usuario.js";
import { TipoUsuario } from "../../airbinb/models/entities/TipoUsuario.js";
import { Caracteristica } from "../../airbinb/models/entities/Caracteristica.js";
import { Foto } from "../../airbinb/models/entities/Foto.js";
import { RangoDeFechas } from "../../airbinb/models/entities/RangoDeFechas.js";
import { Reserva } from "../../airbinb/models/entities/Reserva.js";
import { EstadoReserva } from "../../airbinb/models/entities/EstadoReserva.js";

describe("Usuario", () => {
  const alojamiento = new Alojamiento(
    null,
    "Alojamiento de prueba",
    "Este es un alojamiento de prueba",
    100,
    Moneda.DOLAR_USA,
    10,
    20,
    new Direccion(
      "Cabildo",
      400,
      new Ciudad("La Plata", new Pais("Argentina")),
      "1000A"
    ),
    10,
    new Usuario("Anfitrion", "anfitrion@gmail", TipoUsuario.ANFITRION),
    [Caracteristica.PISCINA],
    [new Foto("../foto1.jpg", "Foto1")]
  );

  test("crear usuario", () => {
    const user = new Usuario("tomás", "tomas@frba.com", TipoUsuario.HUESPED);
    expect(user.nombre).toBe("tomás");
    expect(user.email).toBe("tomas@frba.com");
    expect(user.tipo).toBe(TipoUsuario.HUESPED);
  });

  /*test("realizarReserva", () => {
    const user = new Usuario("tomás", "tomas@frba.com", TipoUsuario.HUESPED);
    const rangoFechas = new RangoDeFechas(
      new Date("2025-10-10"),
      new Date("2025-10-20")
    );
    const reserva = user.realizarReserva(alojamiento, 1, rangoFechas);

    expect(reserva).toBeInstanceOf(Reserva);
    expect(reserva.cantHuespedes).toBe(1);
    expect(reserva.estado).toBe(EstadoReserva.PENDIENTE);
    /*expect(
      new Date(
        reserva.fechaAlta.getFullYear(),
        reserva.fechaAlta.getMonth(),
        reserva.fechaAlta.getDate()
      )
    ).toStrictEqual(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      )
    );
    expect(reserva.huespedReservador).toBe(user);
    expect(reserva.precioPornoche).toBe(100);
    expect(reserva.rangoFechas).toStrictEqual(rangoFechas);
  });*/

  test("excepcion si el usuario que realiza la reserva no es huesped", () => {
    const user = new Usuario("tomás", "tomas@frba.com", TipoUsuario.ANFITRION);
    expect(() =>
      user.realizarReserva(
        alojamiento,
        1,
        new RangoDeFechas(new Date("2025-01-01"), new Date("2025-02-02"))
      )
    ).toThrow();
  });
});
