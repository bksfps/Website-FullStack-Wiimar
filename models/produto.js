// models/Produto.js
import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    imagem: { type: String, required: true },  // Caminho da imagem
    preco: { type: Number, required: true }
});

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;
