import { Usuario } from "../../airbinb/models/entities/Usuario.js";
import { TipoUsuario } from "../../airbinb/models/entities/TipoUsuario.js";
import { RangoDeFechas } from "../../airbinb/models/entities/RangoDeFechas.js";
import { Alojamiento } from "../../airbinb/models/entities/Alojamiento.js";

describe("Usuario", () => {
  let usuario;
  let alojamiento;

  beforeEach(() => {
    usuario = new Usuario("Test User", "test@test.com", TipoUsuario.HUESPED);
    alojamiento = new Alojamiento(
      "1",
      "Test Alojamiento",
      "Description",
      100,
      "USD",
      "10:00",
      "15:00",
      "Test Address",
      4,
      { email: "host@test.com", nombre: "Test Host" },
      ["WIFI"],
      []
    );
  });

  describe("realizarReserva", () => {
    it("should create reservation successfully for valid guest", () => {
      const rangoFechas = new RangoDeFechas(
        new Date("2025-01-01"),
        new Date("2025-01-05")
      );

      const reserva = usuario.realizarReserva(alojamiento, 2, rangoFechas);

      expect(reserva.huespedReservador).toBe(usuario);
      expect(reserva.cantHuespedes).toBe(2);
      expect(reserva.rangoFechas).toBe(rangoFechas);
    });

    it("should throw error when host tries to make reservation", () => {
      const anfitrion = new Usuario("Host", "host@test.com", TipoUsuario.ANFITRION);
      const rangoFechas = new RangoDeFechas(
        new Date("2025-01-01"),
        new Date("2025-01-05")
      );

      expect(() => {
        anfitrion.realizarReserva(alojamiento, 2, rangoFechas);
      }).toThrow("Solo los huéspedes pueden realizar reservas.");
    });

    it("should throw error when guests exceed maximum capacity", () => {
      const rangoFechas = new RangoDeFechas(
        new Date("2025-01-01"),
        new Date("2025-01-05")
      );

      expect(() => {
        usuario.realizarReserva(alojamiento, 10, rangoFechas);
      }).toThrow("La cantidad de huéspedes excede el máximo permitido.");
    });
  });

  describe("recibirNotificacion", () => {
    it("should add notification to user's notifications", () => {
      const notificacion = {
        mensaje: "Test notification",
        fechaCreacion: new Date()
      };

      usuario.recibirNotificacion(notificacion);

      expect(usuario.notificaciones).toHaveLength(1);
      expect(usuario.notificaciones[0]).toBe(notificacion);
    });
  });
});