// Pega o ID do produto da URL
const urlParams = new URLSearchParams(window.location.search);


function getProdutoIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Retorna o valor do parâmetro 'id'
}

const produtoId = getProdutoIdFromUrl();

if (produtoId) {
    fetch(`/api/produtos/${produtoId}`) // URL da sua API
        .then(response => response.json())
        .then(produto => {
            // Preencher a página com as informações do produto
            document.querySelector('#produto-nome').textContent = produto.nome;
            document.querySelector('#produto-descricao').textContent = produto.descricao;
            document.querySelector('#produto-preco').textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
            document.querySelector('#produto-imagem').src = produto.imagemUrl;
        })
        .catch(error => {
            console.error('Erro ao carregar o produto:', error);
            // Aqui você pode adicionar uma mensagem de erro na página
        });
}


// Carrega o produto ao abrir a página
carregarProduto();
