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
        aplicarFiltros(); // Aplica os filtros (se houver)
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
            <a href="produto.html?id=${produto._id}" class="botao">Comprar</a>
        `;
    
        produtosContainer.appendChild(produtoDiv);
    });
}

// Função para aplicar os filtros com base nas checkboxes e no campo de busca
function aplicarFiltros() {
    const termoBusca = searchInput.value.toLowerCase();

    // Filtra os produtos pelo nome (campo de busca)
    let produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(termoBusca));

    // Filtrar por categoria
    const categoriasSelecionadas = Array.from(document.querySelectorAll('.filtro-categoria:checked')).map(checkbox => checkbox.value);
    if (categoriasSelecionadas.length > 0) {
        produtosFiltrados = produtosFiltrados.filter(produto => categoriasSelecionadas.includes(produto.categoria));
    }

    // Filtrar por preço
    const precosSelecionados = Array.from(document.querySelectorAll('.filtro-preco:checked')).map(checkbox => checkbox.value);
    if (precosSelecionados.length > 0) {
        produtosFiltrados = produtosFiltrados.filter(produto => {
            if (precosSelecionados.includes('baixo') && produto.preco < 50) return true;
            if (precosSelecionados.includes('medio') && produto.preco >= 50 && produto.preco <= 100) return true;
            if (precosSelecionados.includes('alto') && produto.preco > 100) return true;
            return false;
        });
    }

    exibirProdutos(produtosFiltrados); // Exibe os produtos filtrados
}

// Função para ativar o filtro da categoria a partir da URL
function ativarFiltroCategoria() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria'); // Obtém o parâmetro "categoria" da URL

    if (categoria) {
        // Marca a checkbox correspondente à categoria
        const checkboxCategoria = document.querySelector(`.filtro-categoria[value="${categoria}"]`);
        if (checkboxCategoria) {
            checkboxCategoria.checked = true;
        }
    }

    aplicarFiltros(); // Aplica os filtros após marcar as checkboxes
}

// Evento de busca
searchInput.addEventListener('input', aplicarFiltros);

// Evento de mudança nos checkboxes de categoria e preço
document.querySelectorAll('.filtro-categoria, .filtro-preco').forEach(checkbox => {
    checkbox.addEventListener('change', aplicarFiltros);
});

// Inicializa a busca e exibição de produtos ao carregar a página
buscarProdutos();

// Chama a função para ativar o filtro de categoria com base na URL
ativarFiltroCategoria();

document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');

    // Verifica se o usuário está logado
    const isLoggedIn = localStorage.getItem('loggedIn');

    if (isLoggedIn) {
        // Se o usuário estiver logado, exibe o botão "Sair"
        authButton.innerHTML = '<a href="#" onclick="logout()">Sair</a>';
    } else {
        // Se o usuário não estiver logado, exibe o botão "Login"
        authButton.innerHTML = '<a href="login.html">Login</a>';
    }
});

// Função de logout
function logout() {
    localStorage.removeItem('loggedIn'); // Remove o estado de login
    window.location.href = 'index.html'; // Redireciona para a homepage
}
