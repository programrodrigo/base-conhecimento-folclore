let cardContainer = document.querySelector(".card-container");
let mensagemBusca = document.querySelector("#mensagem-busca");
let originalCardHTML = new Map();
let dados = [];

async function iniciarBusca() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();

    showCards(dados);

    const campoBusca = document.querySelector("#busca");
    campoBusca.addEventListener("input", () => {
        filtrarCards(campoBusca.value);
    });
}

function filtrarCards(termoBuscado) {
    const termo = termoBuscado.toLowerCase();

    if (termo.length === 0) {
        cardContainer.classList.add('hidden');
        mensagemBusca.classList.remove('hidden');
        mensagemBusca.textContent = "Faça sua busca e mergulhe nos mistérios do Folclore Brasileiro";
        // Restaura o HTML original dos cards
        document.querySelectorAll('.card').forEach(card => {
            if (originalCardHTML.has(card)) {
                card.innerHTML = originalCardHTML.get(card);
            }
        });
        return;
    }

    cardContainer.classList.remove('hidden');
    mensagemBusca.classList.add('hidden');

    let resultadosEncontrados = 0;
    document.querySelectorAll('.card').forEach(card => {
        // Restaura o HTML original antes de uma nova busca
        if (originalCardHTML.has(card)) {
            card.innerHTML = originalCardHTML.get(card);
        }

        const conteudoCard = card.innerText.toLowerCase();
        if (conteudoCard.includes(termo)) {
            card.style.display = 'block';
            resultadosEncontrados++;

            const regex = new RegExp(termo, 'gi'); // 'g' para global, 'i' para case-insensitive
            card.innerHTML = card.innerHTML.replace(regex, (match) => `<mark>${match}</mark>`);
        } else {
            card.style.display = 'none';
        }
    });

    if (resultadosEncontrados === 0) {
        cardContainer.classList.add('hidden');
        mensagemBusca.classList.remove('hidden');
        mensagemBusca.textContent = "Nenhum resultado encontrado";
    }
}

function showCards(data) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes
    for(let each of data) {
        let card = document.createElement("article");
        card.classList.add("card");

        card.innerHTML = `
            <h2>${each.nome}</h2>
            <h3>Região: ${each.regiao}</h3>
            <p>${each.descricao}</p>
        `
        cardContainer.appendChild(card);

        // Armazena o HTML original de cada card
        originalCardHTML.set(card, card.innerHTML);
    }
}

iniciarBusca();