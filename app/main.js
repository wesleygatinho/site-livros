let livros = [];
const endPointDaAPI = 'https://guilhermeonrails.github.io/casadocodigo/livros.json';

getBuscarLivrosDaAPI();

const elementosParaInserirLivros = document.getElementById('livros');

async function getBuscarLivrosDaAPI() {
    const res = await fetch(endPointDaAPI);
    livros = await res.json();
    let livrosComDesconto = aplicarDesconto(livros);
    exibirMeusLivrosNaTela(livrosComDesconto);
    
}

//Metodo forEach
const elementoValorTotalNaTela = document.getElementById('valor_total_livros_disponiveis');

function exibirMeusLivrosNaTela(listaDeLivros) {
    elementoValorTotalNaTela.innerHTML = ``;
    elementosParaInserirLivros.innerHTML = ``;
    listaDeLivros.forEach(livro => {
        let disponibilidade = livro.quantidade > 0 ? 'livro__imagens': 'livro__imagens indisponivel';
        elementosParaInserirLivros.innerHTML += `
            <div class="livro">
                <img class="${disponibilidade}" src="${livro.imagem}" alt="${livro.alt}" />
                <h2 class="livro__titulo">
                    ${livro.titulo}
                </h2>
                <p class="livro__descricao">${livro.autor}</p>
                <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
                <div class="tags">
                    <span class="tag">${livro.categoria}</span>
                </div>
             </div>
        `
    });
}



//Metodo Map

function aplicarDesconto(livros) {
    const desconto = 0.3;
    livrosComDesconto = livros.map(livro => {
        return {...livro, preco: livro.preco - (livro.preco * desconto)}
    })
    return livrosComDesconto;
}


//Método Filter

const botoes = document.querySelectorAll('.btn');
botoes.forEach(btn => btn.addEventListener('click', filtrarLivros))

function filtrarLivros() {
    const elementoBtn = document.getElementById(this.id);
    const categoria = elementoBtn.value;
    let livrosFiltrados = categoria == 'disponivel' ? filtrarPorDisponibilidades():
    filtrarPorCategoria(categoria);
    exibirMeusLivrosNaTela(livrosFiltrados);
    
    if (categoria == 'disponivel') {
        const valorTotal = calculoTotalLivrosDisponiveis(livrosFiltrados);
        exibirValorTotalNaTela(valorTotal);
    }
}

function filtrarPorCategoria(categoria) {
    return livros.filter(livro => livro.categoria == categoria);
}

function filtrarPorDisponibilidades() {
    return livros.filter(livro => livro.quantidade > 0);
}

function exibirValorTotalNaTela(valorTotal) {
    elementoValorTotalNaTela.innerHTML = `
    <div class="livros__disponiveis">
        <p>Todos os livros disponíveis por R$ <span id="valor">${valorTotal}</span></p>
    </div>
    `
}

//Metodo Sort

let btnOrdenarPorPreco = document.getElementById('btnOrdenarPorPreco');
btnOrdenarPorPreco.addEventListener('click', ordenarLivrosPorPreco);

function ordenarLivrosPorPreco() {
    let livrosOrdenados = livros.sort((a, b) => a.preco - b.preco);
    exibirMeusLivrosNaTela(livrosOrdenados);
}


//Método Reduce

function calculoTotalLivrosDisponiveis(livros) {
    return livros.reduce((acc, livro) => acc + livro.preco, 0 ).toFixed(2);
}
