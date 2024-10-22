document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get('id');

    if (produtoId) {
        buscarProduto(produtoId);
    }
});

// Função para buscar o produto específico
async function buscarProduto(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/produtos/${id}`); // Ajuste conforme sua API
        const produto = await response.json();
        exibirResumoProduto(produto);
    } catch (error) {
        console.error('Erro ao buscar o produto:', error);
    }
}

// Função para exibir o resumo do produto
function exibirResumoProduto(produto) {
    const produtoResumo = document.getElementById('produto-resumo');
    produtoResumo.innerHTML = `
        <p><strong>Nome:</strong> ${produto.nome}</p>
        <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
        <p><strong>Descrição:</strong> ${produto.descricao}</p>
    `;
}
