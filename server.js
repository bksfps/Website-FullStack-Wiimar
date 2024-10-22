import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import Usuario from './models/Usuario.js';
import Produto from './models/produto.js';
import { calcularPrecoPrazo } from 'correios-brasil'; // Importa o pacote correios-brasil


const app = express();
app.use(express.static('public'));
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/estoque', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Página inicial
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// Rota para buscar produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Rota para buscar um produto pelo ID
app.get('/api/produtos/:id', async (req, res) => {
    const produtoId = req.params.id;

    try {
        const produto = await Produto.findById(produtoId);
        if (produto) {
            res.json(produto);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

// Rota para cálculo de frete
app.get('/calcular-frete', (req, res) => {
    const { cepDestino } = req.query; // Recebe o CEP de destino do front-end

    const dadosFrete = {
        sCepOrigem: '07178-696', // CEP de origem da loja
        sCepDestino: cepDestino, // CEP de destino recebido do front-end
        nVlPeso: '1', // Peso do produto em kg
        nCdFormato: '1', // Formato: caixa/pacote
        nVlComprimento: '20', // Comprimento em cm
        nVlAltura: '20', // Altura em cm
        nVlLargura: '20', // Largura em cm
        nCdServico: ['04014'], // Código do serviço (04014 para SEDEX)
        nVlDiametro: '0', // Diâmetro
    };

    calcularPrecoPrazo(dadosFrete)
    .then(response => {
        const resultado = response[0]; // Recebe a resposta da API dos Correios
        res.json({
            valorFrete: resultado.Valor,
            prazoEntrega: resultado.PrazoEntrega
        });
    })
    .catch(error => {
        console.error('Erro ao calcular o frete:', error);
        res.status(500).json({ error: 'Erro ao calcular o frete.' });
    });
});

// Outras rotas de produtos e usuários...

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
