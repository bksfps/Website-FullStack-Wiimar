// Pega o ID do produto da URL
function getProdutoIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Retorna o valor do parâmetro 'id'
}

const produtoId = getProdutoIdFromUrl();

if (produtoId) {
    fetch(`/api/produtos/${produtoId}`)
        .then(response => response.json())
        .then(produto => {
            if (produto) {
                // Preencher a página com as informações do produto
                document.querySelector('#produto-nome').textContent = produto.nome;
                document.querySelector('#produto-descricao').textContent = produto.descricao;
                document.querySelector('#produto-preco').textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
                document.querySelector('#produto-imagem').src = produto.imagemUrl;

                // Define ações para os botões
                document.querySelector('#botao-comprar').addEventListener('click', () => comprarProduto(produto));
                document.querySelector('#botao-adicionar').addEventListener('click', () => adicionarAoCarrinho(produto));

                // Exibir produtos relacionados
                exibirProdutosRelacionados(produto.categoria);
            } else {
                console.error('Produto não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o produto:', error);
        });
} else {
    console.error('ID do produto não encontrado na URL');
}

// Função para comprar o produto e redirecionar para a página de pagamento
function comprarProduto(produto) {
    const pagamentoUrl = `pagamento.html?id=${produto._id}`;
    window.location.href = pagamentoUrl; // Redireciona para a tela de pagamento com o ID do produto
}

// Função para adicionar o produto ao carrinho
function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item._id === produto._id);

    if (produtoExistente) {
        produtoExistente.quantidade += 1; // Se já existe, incrementa a quantidade
    } else {
        produto.quantidade = 1; // Adiciona o produto com quantidade 1
        carrinho.push(produto);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Salva no localStorage
    alert(`${produto.nome} foi adicionado ao carrinho!`);
    
    // Atualiza a quantidade no ícone do carrinho
    atualizarQuantidadeCarrinho();
    carregarItensDoCarrinho(); // Atualiza o dropdown do carrinho
}

// Atualiza a quantidade de itens no ícone do carrinho
function atualizarQuantidadeCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const quantidadeTotal = carrinho.reduce((total, item) => total + item.quantidade, 0);
    document.getElementById('carrinho-quantidade').textContent = quantidadeTotal;
}

// Função para carregar os itens do carrinho no dropdown
function carregarItensDoCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itensContainer = document.getElementById('itens-carrinho');
    itensContainer.innerHTML = '';

    if (carrinho.length === 0) {
        itensContainer.innerHTML = '<p>Carrinho vazio.</p>';
    } else {
        carrinho.forEach(produto => {
            const item = document.createElement('div');
            item.classList.add('carrinho-item');
            item.innerHTML = `
                <p>${produto.nome} - Quantidade: ${produto.quantidade}</p>
                <p>Preço: R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</p>
            `;
            itensContainer.appendChild(item);
        });
    }
}

// Função para calcular o frete
document.getElementById('calcular-frete').addEventListener('click', function () {
    const cepDestino = document.getElementById('cep').value;

    if (cepDestino) {
        fetch(`/calcular-frete?cepDestino=${cepDestino}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('resultado-frete').innerText =
                    `Frete: R$ ${data.valorFrete} - Prazo: ${data.prazoEntrega} dias`;
            })
            .catch(error => {
                console.error('Erro ao calcular o frete:', error);
                document.getElementById('resultado-frete').innerText = 'Erro ao calcular o frete.';
            });
    } else {
        alert('Por favor, insira um CEP válido.');
    }
});

// Chama a função ao carregar a página para exibir os itens do carrinho
document.addEventListener('DOMContentLoaded', () => {
    carregarItensDoCarrinho(); // Carrega os itens do carrinho
    atualizarQuantidadeCarrinho(); // Atualiza a quantidade no ícone do carrinho
});

// Atualiza a exibição do carrinho ao clicar no ícone
document.getElementById('icone-carrinho').addEventListener('click', () => {
    const dropdown = document.getElementById('dropdown-carrinho');
    dropdown.classList.toggle('show'); // Exibe ou oculta o dropdown
});

document.getElementById('ver-carrinho').addEventListener('click', () => {
    window.location.href = 'carrinho.html'; // Redireciona para a página carrinho.html
});

// Função para exibir produtos relacionados
function exibirProdutosRelacionados(categoria) {
    fetch('/api/produtos')
        .then(response => response.json())
        .then(produtos => {
            // Filtra os produtos pela mesma categoria
            const produtosRelacionados = produtos.filter(produto => produto.categoria === categoria);

            // Se não houver produtos da mesma categoria, exibe aleatoriamente outros produtos
            if (produtosRelacionados.length === 0) {
                exibirProdutosAleatorios(produtos);
            } else {
                exibirProdutos(produtosRelacionados);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar produtos relacionados:', error);
        });
}

// Função para exibir produtos aleatórios
function exibirProdutosAleatorios(produtos) {
    const produtosAleatorios = produtos.sort(() => Math.random() - 0.5).slice(0, 4); // Seleciona 4 produtos aleatórios
    exibirProdutos(produtosAleatorios);
}

// Função para exibir os produtos na seção de "produtos relacionados"
function exibirProdutos(produtos) {
    const produtosRelacionadosContainer = document.getElementById('produtos-relacionados');
    produtosRelacionadosContainer.innerHTML = ''; // Limpa a seção antes de adicionar novos produtos

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto-relacionado');
        produtoDiv.innerHTML = `
            <img src="${produto.imagemUrl}" alt="${produto.nome}">
            <h4>${produto.nome}</h4>
            <p>R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
            <a href="produto.html?id=${produto._id}" class="botao">Ver Detalhes</a>
        `;
        produtosRelacionadosContainer.appendChild(produtoDiv);
    });
}


