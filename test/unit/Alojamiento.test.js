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

describe("Alojamiento", () => {
  let alojamiento;

  const nombre = "Casa grande";
  const descripcion = "Esta es un test de una casa grande";
  const precioPorNoche = 500000;
  const moneda = Moneda.PESO_ARG;
  const horarioCheckIn = 10;
  const horarioCheckOut = 18;
  const direccion = new Direccion(
    "Calle 7",
    999,
    new Ciudad("La Plata", new Pais("Argentina")),
    1900
  );
  const cantHuespedesMax = 4;
  const anfitrion = new Usuario(
    "Tomás",
    "tomas@anfitriones.com",
    TipoUsuario.ANFITRION
  );
  const caracteristicas = [
    Caracteristica.ESTACIONAMIENTO,
    Caracteristica.PISCINA,
  ];
  const fotos = [
    new Foto("./fotos/foto1.jpg", "Foto de la casa"),
    new Foto("./fotos/foto2.jpg", "Foto de la pileta"),
  ];

  beforeEach(() => {
    alojamiento = new Alojamiento(
      1,
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
    );
  });

  test("debe asignar correctamente los atributos", () => {
    expect(alojamiento.nombre).toBe(nombre);
    expect(alojamiento.descripcion).toBe(descripcion);
    expect(alojamiento.precioPorNoche).toBe(precioPorNoche);
    expect(alojamiento.moneda).toBe(moneda);
    expect(alojamiento.horarioCheckIn).toBe(horarioCheckIn);
    expect(alojamiento.horarioCheckOut).toBe(horarioCheckOut);
    expect(alojamiento.direccion).toBe(direccion);
    expect(alojamiento.cantHuespedesMax).toBe(cantHuespedesMax);
    expect(alojamiento.anfitrion).toBe(anfitrion);
    expect(alojamiento.caracteristicas).toBe(caracteristicas);
    expect(alojamiento.fotos).toBe(fotos);
    expect(alojamiento.reservas).toStrictEqual([]);
  });

  test("tuPrecioEstaDentroDe", () => {
    expect(alojamiento.tuPrecioEstaDentroDe(0, 999999)).toBe(true);
    expect(alojamiento.tuPrecioEstaDentroDe(0, precioPorNoche)).toBe(true);
    expect(alojamiento.tuPrecioEstaDentroDe(precioPorNoche, 0)).toBe(false);
    expect(alojamiento.tuPrecioEstaDentroDe(precioPorNoche, 999999)).toBe(true);
    expect(() =>
      alojamiento.tuPrecioEstaDentroDe(-1, precioPorNoche)
    ).toThrow();
    expect(() =>
      alojamiento.tuPrecioEstaDentroDe(precioPorNoche, -1)
    ).toThrow();
    expect(() => alojamiento.tuPrecioEstaDentroDe(-99999, -100)).toThrow();
    expect(() =>
      alojamiento.tuPrecioEstaDentroDe(-99999, precioPorNoche)
    ).toThrow();
  });

  test("tenesCaracteristica", () => {
    expect(
      alojamiento.tenesCaracteristica(Caracteristica.ESTACIONAMIENTO)
    ).toBe(true);
    expect(alojamiento.tenesCaracteristica(Caracteristica.PISCINA)).toBe(true);
    expect(alojamiento.tenesCaracteristica(Caracteristica.WIFI)).toBe(false);
    expect(
      alojamiento.tenesCaracteristica(Caracteristica.MASCOTAS_PERMITIDAS)
    ).toBe(false);
  });

  test("puedenAlojarse", () => {
    expect(alojamiento.puedenAlojarse(0)).toBe(true);
    expect(alojamiento.puedenAlojarse(4)).toBe(true);
    expect(alojamiento.puedenAlojarse(50)).toBe(false);
    expect(() => alojamiento.puedenAlojarse(-50)).toThrow();
  });

  test("estasDisponibleEn", () => {
    const rango = new RangoDeFechas(
      new Date("2025-10-10"),
      new Date("2025-10-20")
    );
    expect(alojamiento.estasDisponibleEn(rango)).toBe(true);
  });

  test("aceptar y rechazar reservas", () => {
    const rango = new RangoDeFechas(
      new Date("2024-01-01"),
      new Date("2025-01-01")
    );
    const reserva = new Reserva(
      new Usuario("smalirat", "smalirat@frba", TipoUsuario.HUESPED),
      3,
      rango,
      100
    );

    alojamiento.aceptarReserva(reserva);
    expect(reserva.estado).toBe(EstadoReserva.CONFIRMADA);
    expect(alojamiento.reservas).toHaveLength(1);

    expect(() => alojamiento.aceptarReserva(reserva)).toThrow();

    expect(() =>
      alojamiento.cancelarReserva(
        reserva_aux = new Reserva("Reserva inexistente", 0, rango, 0)
      )
    ).toThrow();

    alojamiento.cancelarReserva(reserva);
    expect(reserva.estado).toBe(EstadoReserva.CANCELADA);
  });
});
