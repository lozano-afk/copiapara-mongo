import request from 'supertest';
import { buildTestServer } from './utils/server.js';
import { ReservaController } from '../../airbinb/controllers/reservaController.js';
import { connectDB } from '../../airbinb/db.js';
import mongoose from 'mongoose';
import { ModeloReserva } from '../../airbinb/models/schemas/reservaSchema.js';
import { ModeloUsuario } from '../../airbinb/models/schemas/usuarioSchema.js';

const server = buildTestServer();

describe('Reserva API', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await ModeloReserva.deleteMany({});
    await ModeloUsuario.deleteMany({});
  });

  describe('GET /reservas', () => {
    it('should return empty array when no reservas exist', async () => {
      const response = await request(server.app).get('/reservas');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all reservas', async () => {
      // Create test user
      const usuario = await ModeloUsuario.create({
        nombre: 'Test User',
        email: 'test@test.com',
        tipo: 'HUESPED'
      });

      // Create test reserva
      await ModeloReserva.create({
        huespedReservador: usuario._id,
        cantHuespedes: 2,
        idAlojamiento: new mongoose.Types.ObjectId(),
        rangoFechas: {
          fechaInicio: new Date('2025-01-01'),
          fechaFin: new Date('2025-01-05')
        }
      });

      const response = await request(server.app).get('/reservas');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].cantHuespedes).toBe(2);
    });
  });

  describe('POST /reservas', () => {
    it('should create new reserva with valid data', async () => {
      const usuario = await ModeloUsuario.create({
        nombre: 'Test User',
        email: 'test@test.com',
        tipo: 'HUESPED'
      });

      const reservaData = {
        huespedReservador: usuario.email,
        cantHuespedes: 2,
        idAlojamiento: new mongoose.Types.ObjectId().toString(),
        fechaInicio: '2025-01-01',
        fechaFin: '2025-01-05'
      };

      const response = await request(server.app)
        .post('/reservas')
        .send(reservaData);

      expect(response.status).toBe(201);
      expect(response.body.cantHuespedes).toBe(2);
      expect(response.body.huespedReservador.email).toBe(usuario.email);
    });

    it('should return 400 with invalid data', async () => {
      const response = await request(server.app)
        .post('/reservas')
        .send({});

      expect(response.status).toBe(400);
    });
  });
});