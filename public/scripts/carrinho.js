// Função para carregar o carrinho
function carregarCarrinho() {
    // Pega os itens do carrinho no localStorage
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoContainer = document.getElementById('carrinhoContainer');
    const carrinhoQuantidadeElement = document.getElementById('carrinho-quantidade');

    carrinhoContainer.innerHTML = ''; // Limpa o contêiner

    // Atualiza a quantidade no ícone do carrinho
    const carrinhoQuantidade = carrinho.reduce((total, produto) => total + produto.quantidade, 0);
    carrinhoQuantidadeElement.textContent = carrinhoQuantidade;

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }

    // Exibir itens no carrinho
    carrinho.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto-carrinho');

        const precoTotal = produto.preco * produto.quantidade;
        const precoFormatado = `R$ ${precoTotal.toFixed(2).replace('.', ',')}`;

        produtoDiv.innerHTML = `
            <img src="${produto.imagemUrl}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <div class="quantidade-container">
                <button class="diminuir-quantidade" data-id="${produto._id}">-</button>
                <span>${produto.quantidade}</span>
                <button class="aumentar-quantidade" data-id="${produto._id}">+</button>
            </div>
            <p>Preço: ${precoFormatado}</p>
            <button class="remover-produto" data-id="${produto._id}">Remover</button>
        `;

        carrinhoContainer.appendChild(produtoDiv);
    });
}

// Chama a função ao carregar a página para exibir os itens do carrinho
document.addEventListener('DOMContentLoaded', carregarCarrinho);

// Aumentar a quantidade do produto
document.addEventListener('click', function(event) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtoId = event.target.getAttribute('data-id');

    if (event.target.classList.contains('aumentar-quantidade')) {
        const produto = carrinho.find(item => item._id === produtoId);
        if (produto) {
            produto.quantidade += 1; // Aumenta a quantidade
            localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza no localStorage
            carregarCarrinho(); // Atualiza a exibição
        }
    }

    // Diminuir a quantidade do produto
    if (event.target.classList.contains('diminuir-quantidade')) {
        const produto = carrinho.find(item => item._id === produtoId);
        if (produto) {
            if (produto.quantidade > 1) {
                produto.quantidade -= 1; // Diminui a quantidade
            } else {
                carrinho = carrinho.filter(item => item._id !== produtoId); // Remove o produto se a quantidade for 0
            }
            localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza no localStorage
            carregarCarrinho(); // Atualiza a exibição
        }
    }

    // Remover produto
    if (event.target.classList.contains('remover-produto')) {
        const produto = carrinho.filter(item => item._id !== produtoId); // Remove o produto
        localStorage.setItem('carrinho', JSON.stringify(produto)); // Atualiza no localStorage
        carregarCarrinho(); // Atualiza a exibição
    }
});

// Inicializa o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', carregarCarrinho);

// Adiciona evento de clique ao botão "Comprar"
document.getElementById('botao-comprar').addEventListener('click', function() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!"); // Alerta se o carrinho estiver vazio
        return;
    }

    // Você pode querer armazenar os produtos em um formato diferente para a página de pagamento
    const produtosParaPagamento = carrinho.map(produto => ({
        id: produto._id,
        quantidade: produto.quantidade,
        preco: produto.preco,
        nome: produto.nome
    }));

    // Armazena os produtos para a página de pagamento
    localStorage.setItem('produtosParaPagamento', JSON.stringify(produtosParaPagamento));

    // Redireciona para a página de pagamento
    window.location.href = 'pagamento.html';
});

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