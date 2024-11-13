// models/Usuario.js
import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    senha: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
