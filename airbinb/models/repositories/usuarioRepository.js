import { ModeloUsuario } from "../schemas/usuarioSchema.js";
import { ModeloReserva } from "../schemas/reservaSchema.js";

export class UsuarioRepository {
  async save(usuario) {
    const docExistente = await ModeloUsuario.findOne({ email: usuario.email });

    if (docExistente) {
      await ModeloUsuario.updateOne(
        { email: usuario.email },
        {
          nombre: usuario.nombre,
          tipo: usuario.tipo,
          reservas: usuario.reservas || [],
          notificaciones: usuario.notificaciones || [],
        }
      );
      return usuario;
    } else {
      const nuevoDoc = new ModeloUsuario({
        nombre: usuario.nombre,
        email: usuario.email,
        tipo: usuario.tipo,
        reservas: usuario.reservas || [],
        notificaciones: usuario.notificaciones || [],
      });
      const saved = await nuevoDoc.save();
      return usuario;
    }
  }

  async findByEmail(email) {
    const doc = await ModeloUsuario.findOne({ email }).populate("reservas");
    return doc;
  }

  async findById(email) {
    return this.findByEmail(email);
  }

  async findAll() {
    return await ModeloUsuario.find().populate("reservas");
  }

  async deleteById(email) {
    const result = await ModeloUsuario.deleteOne({ email });
    return result.deletedCount > 0;
  }

  async deleteByEmail(email) {
    return this.deleteById(email);
  }

  async findUsuario(usuario) {
    return this.findByEmail(usuario.email);
  }
}
