// models/Produto.js
import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    imagem: { type: String, required: true },
    preco: { type: Number, required: true },
    categoria: { type: String, required: true }
});

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;
