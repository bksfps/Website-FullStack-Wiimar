import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; // Para a conexão com o MongoDB
import fetch from 'node-fetch'; // Agora usa a sintaxe de importação
import Usuario from './models/Usuario.js'; // Importando o modelo de Usuário
import Produto from './models/produto.js';

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Middleware para interpretar requisições com JSON
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/estoque', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Define a página inicial como a tela de login
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// Redireciona requisições do front-end para a API Spring Boot
app.post('/api/produtos', async (req, res) => {
    const response = await fetch('http://localhost:8080/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
});

app.put('/api/produtos/remover/:id', async (req, res) => {
    const id = req.params.id;
    const quantidade = req.query.quantidade;
    
    const response = await fetch(`http://localhost:8080/produtos/remover/${id}?quantidade=${quantidade}`, {
        method: 'PUT'
    });
    
    if (response.ok) {
        res.status(200).send('Quantidade removida');
    } else {
        res.status(500).send('Erro ao remover quantidade');
    }
});

app.delete('/api/produtos/:id', async (req, res) => {
    const id = req.params.id;
    
    const response = await fetch(`http://localhost:8080/produtos/${id}`, {
        method: 'DELETE'
    });
    
    if (response.ok) {
        res.status(200).send('Produto deletado');
    } else {
        res.status(500).send('Erro ao deletar produto');
    }
});

// Rotas de cadastro e login de usuários
app.post('/usuarios/cadastrar', async (req, res) => {
    const { username, email, phone, senha } = req.body;

    const usuario = new Usuario({ username, email, phone, senha });
    try {
        await usuario.save();
        res.status(201).send('Usuário cadastrado com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao cadastrar usuário');
        console.error(error);
    }
});

app.post('/usuarios/login', async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (usuario && usuario.senha === senha) {
        res.status(200).send('Login bem-sucedido');
    } else {
        res.status(401).send('Usuário ou senha incorretos');
    }
});

app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find(); // Busca todos os produtos no banco de dados
        res.json(produtos); // Retorna os produtos em formato JSON
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Rota para a página de detalhes do produto
app.get('/produto/:id', async (req, res) => {
    const produtoId = req.params.id;

    try {
        const produto = await Produto.findById(produtoId); // Busca o produto no banco de dados pelo ID
        if (produto) {
            res.sendFile('produto.html', { root: 'public' });
        } else {
            res.status(404).send('Produto não encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produto' });
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



// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
