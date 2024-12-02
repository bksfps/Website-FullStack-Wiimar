document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosParaPagamento();
});

// Função para carregar os produtos do carrinho
function carregarProdutosParaPagamento() {
    const produtosParaPagamento = JSON.parse(localStorage.getItem('produtosParaPagamento')) || [];
    const produtoResumo = document.getElementById('produto-resumo');

    produtoResumo.innerHTML = ''; // Limpa o contêiner

    if (produtosParaPagamento.length === 0) {
        produtoResumo.innerHTML = '<p>Nenhum produto para exibir.</p>';
        return;
    }

    let total = 0;

    // Exibir os produtos e calcular o total
    produtosParaPagamento.forEach(produto => {
        const precoTotal = produto.preco * produto.quantidade;
        total += precoTotal;
        
        const produtoDiv = document.createElement('div');
        produtoDiv.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>Quantidade: ${produto.quantidade}</p>
            <p>Preço: R$ ${precoTotal.toFixed(2).replace('.', ',')}</p>
        `;
        produtoResumo.appendChild(produtoDiv);
    });

    // Exibir o total final
    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `<h3>Total: R$ ${total.toFixed(2).replace('.', ',')}</h3>`;
    produtoResumo.appendChild(totalDiv);
}


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