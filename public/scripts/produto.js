// Pega o ID do produto da URL
function getProdutoIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get('id'); // Retorna o valor do parâmetro 'id'
    console.log('Produto ID:', produtoId); // Verifica se o ID foi capturado corretamente
    return produtoId;
}

const produtoId = getProdutoIdFromUrl();

if (produtoId) {
    fetch(`/api/produtos/${produtoId}`) // URL da sua API
        .then(response => response.json())
        .then(produto => {
            if (produto) {
                // Preencher a página com as informações do produto
                document.querySelector('#produto-nome').textContent = produto.nome;
                document.querySelector('#produto-descricao').textContent = produto.descricao;
                document.querySelector('#produto-preco').textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
                document.querySelector('#produto-imagem').src = produto.imagemUrl;
            } else {
                console.error('Produto não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o produto:', error);
            // Aqui você pode adicionar uma mensagem de erro na página
        });
} else {
    console.error('ID do produto não encontrado na URL');
}

// Função para calcular o frete chamando o back-end
document.getElementById('calcular-frete').addEventListener('click', function() {
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

document.addEventListener('DOMContentLoaded', () => {
    const botaoComprar = document.getElementById('botao-comprar');
    
    botaoComprar.addEventListener('click', function() {
        if (produtoId) {
            // Redireciona o usuário para a página de pagamento com o ID do produto na URL
            window.location.href = `pagamento.html?id=${produtoId}`;
        } else {
            console.error('ID do produto não encontrado.');
        }
    });
});
