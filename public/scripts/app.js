// URL da API
const apiUrl = 'http://localhost:3000/api/produtos'; // Ajuste conforme seu ambiente

// Elementos do DOM
const produtosContainer = document.getElementById('produtos-container');
const searchInput = document.getElementById('search-input');
let produtos = []; // Variável global para armazenar os produtos

// Função para buscar produtos da API
async function buscarProdutos() {
    try {
        const response = await fetch(apiUrl); // Requisição GET para a API
        produtos = await response.json(); // Converte a resposta em JSON
        exibirProdutos(produtos); // Exibe os produtos
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Função para exibir produtos
function exibirProdutos(produtosFiltrados) {
    // Limpa o container de produtos antes de renderizar
    produtosContainer.innerHTML = '';

    // Verifica se há produtos
    if (produtosFiltrados.length === 0) {
        produtosContainer.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }

    // Itera sobre os produtos filtrados e cria o HTML dinamicamente
    produtosFiltrados.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('box');
    
        // Formatação do preço
        const precoFormatado = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
    
        // Adiciona o HTML do produto
        produtoDiv.innerHTML = `
            <img src="${produto.imagemUrl}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <p>${precoFormatado}</p>
            <a href="#" class="botao">Comprar</a>
        `;
    
        produtosContainer.appendChild(produtoDiv);
    });
}

// Função para filtrar os produtos com base no termo de busca
function filtrarProdutos() {
    const termoBusca = searchInput.value.toLowerCase(); // Converte o termo para minúsculas
    const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(termoBusca));
    exibirProdutos(produtosFiltrados); // Exibe os produtos filtrados
}

// Evento de busca
searchInput.addEventListener('input', filtrarProdutos);

// Inicializa a busca e exibição de produtos ao carregar a página
buscarProdutos();
