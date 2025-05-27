import request from "supertest"
import { buildTestServer } from "./utils/server.js"
import alojamientoRoutes from "../../alojamientos/routes/alojamientoRoutes.js"
import { AlojamientoService } from "../../alojamientos/services/alojamientoService.js"
import { AlojamientoController } from "../../alojamientos/controllers/alojamientoController.js"
import { describe, test, expect, jest } from "@jest/globals"
import { Alojamiento } from "../../alojamientos/models/entities/alojamiento.js"

const server = buildTestServer()
server.addRoute(alojamientoRoutes)
server.configureRoutes()

const mockAlojamientos = [
  new Alojamiento(
    1,
    "Cabaña en el bosque",
    "Hermosa cabaña en el bosque",
    100,
    "USD",
    "14:00",
    "10:00",
    "Bosque encantado 123",
    4,
    { id: "ana86@gmail.com", nombre: "Ana Anfitriona" },
    ["WiFi", "Chimenea"],
    ["foto1.jpg"]
  ),
  new Alojamiento(
    2,
    "Depto en la ciudad",
    "Moderno departamento céntrico",
    80,
    "USD",
    "15:00",
    "11:00",
    "Av. Central 456",
    2,
    { id: "ana86@gmail.com", nombre: "Carlos Centro" },
    ["TV", "Cocina"],
    ["foto2.jpg"]
  )
]

const alojamientoRepository = {
  findByPage: jest.fn().mockResolvedValue(mockAlojamientos),
  countAll: jest.fn().mockResolvedValue(2),
  save: jest.fn(),
  findById: jest.fn(),
  findByRangoPrecioYCaracteristicas: jest.fn()
}

const alojamientoService = new AlojamientoService(alojamientoRepository)
const alojamientoController = new AlojamientoController(alojamientoService)

server.setController(AlojamientoController, alojamientoController)

describe("GET /alojamientos", () => {
  test("debe retornar 200 con todos los alojamientos paginados", async () => {
    const response = await request(server.app).get("/alojamientos")

    expect(response.status).toBe(200)
    expect(response.body.total).toBe(2)
    expect(response.body.data.length).toBe(2)
    expect(response.body.data[0].nombre).toBe("Cabaña en el bosque")
  })
})

describe("POST /alojamientos", () => {
  test("debe retornar 201 si se crea un alojamiento correctamente", async () => {
    const nuevoAlojamiento = {
      nombre: "Casa rural",
      descripcion: "Tranquila casa rural",
      precioPorNoche: 70,
      moneda: "USD",
      horarioCheckIn: "13:00",
      horarioCheckOut: "11:00",
      direccion: "Ruta 7 km 22",
      cantHuespedesMax: 5,
      anfitrionId: 1,
      caracteristicas: ["Parrilla", "Pileta"],
      fotos: ["foto3.jpg"]
    }

    alojamientoRepository.save.mockResolvedValue()

    const response = await request(server.app)
      .post("/alojamientos")
      .send(nuevoAlojamiento)

    expect(response.status).toBe(201)
    expect(alojamientoRepository.save).toHaveBeenCalled()
  })

  test("debe retornar 400 si falta el nombre", async () => {
    const alojamientoInvalido = {
      descripcion: "Sin nombre",
      precioPorNoche: 50,
      moneda: "USD",
      horarioCheckIn: "13:00",
      horarioCheckOut: "11:00",
      direccion: "Calle falsa 123",
      cantHuespedesMax: 3,
      anfitrionId: 1,
      caracteristicas: [],
      fotos: []
    }

    const response = await request(server.app)
      .post("/alojamientos")
      .send(alojamientoInvalido)

    expect(response.status).toBe(400)
    expect(response.body.error).not.toBeUndefined()
  })

  test("debe retornar 400 si el anfitrión no existe", async () => {
    alojamientoRepository.findUsuarioById = jest.fn().mockResolvedValue(null)

    const nuevoAlojamiento = {
      nombre: "Loft urbano",
      descripcion: "Ideal para escapadas",
      precioPorNoche: 90,
      moneda: "USD",
      horarioCheckIn: "14:00",
      horarioCheckOut: "10:00",
      direccion: "Ciudad 456",
      cantHuespedesMax: 2,
      anfitrionId: 999, // inexistente
      caracteristicas: ["Ascensor"],
      fotos: []
    }

    const response = await request(server.app)
      .post("/alojamientos")
      .send(nuevoAlojamiento)

    expect(response.status).toBe(400)
    expect(response.body.error).toMatch(/anfitrión no existe/i)
  })
})
