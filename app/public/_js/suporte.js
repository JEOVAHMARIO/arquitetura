// public/_js/suporte.js

async function area() {
    console.log('teste');
    try {
        let inputNome = document.querySelector('[name=nome]');
        let nome = inputNome.value;
        let inputLado = document.querySelector('[name=lado]');
        let lado = parseFloat(inputLado.value);
        let inputIdPapel = document.querySelector('[name=id_papel]');
        let idPapel = parseFloat(inputIdPapel.value);
        let inputSenha = document.querySelector('[name=senha]');
        let senha = inputSenha.value;
        console.log('teste');
        let octogonal = { nome, lado, id_papel: idPapel, senha };

        if (idPapel === 0) {
            await inserir(octogonal);
        } else {
            await editar(octogonal, idPapel);
        }

        await listar();
    } catch (error) {
        console.log('teste');
        console.error('Erro ao processar área:', error);
    }
}

async function inserir(octogonal) {
    try {
        let divResposta = document.querySelector('#mensagem');
        let dados = new URLSearchParams(octogonal);

        let resposta = await fetch('/area', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: dados
        });

        if (resposta.status === 200) {
            divResposta.classList.add('pequeno');
            divResposta.classList.remove('especial');
        } else {
            divResposta.classList.add('especial');
            divResposta.classList.remove('pequeno');
        }

        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
    } catch (error) {
        console.error('Erro ao inserir:', error);
    }
}

async function listar() {
    let divOctogonais = document.querySelector('#octogonais');
    divOctogonais.innerText = 'Carregando...';

    try {
        let resposta = await fetch('/suportes');
        let octogonais = await resposta.json();

        divOctogonais.innerHTML = '';

        for (let octogonal of octogonais) {
            let linha = document.createElement('tr');

            for (let propriedade in octogonal) {
                if (octogonal.hasOwnProperty(propriedade)) {
                    let coluna = document.createElement('td');
                    coluna.innerText = octogonal[propriedade];
                    linha.appendChild(coluna);
                }
            }

            let colunaAcoes = document.createElement('td');
            let botaoEditar = document.createElement('button');
            let botaoApagar = document.createElement('button');

            botaoEditar.innerText = 'Editar';
            botaoEditar.onclick = function () {
                formEditar(octogonal.id);
            };

            botaoApagar.onclick = function () {
                apagar(octogonal.id);
            };
            botaoApagar.innerText = 'Apagar';

            colunaAcoes.appendChild(botaoEditar);
            colunaAcoes.appendChild(botaoApagar);

            linha.appendChild(colunaAcoes);
            divOctogonais.appendChild(linha);
        }
    } catch (error) {
        console.error('Erro ao listar:', error);
    }
}

async function editar(octogonal, id) {
    try {
        let divResposta = document.querySelector('#mensagem');
        let dados = new URLSearchParams(octogonal);

        let resposta = await fetch('/suportes/' + id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: dados
        });

        if (resposta.status === 200) {
            divResposta.classList.add('pequeno');
            divResposta.classList.remove('especial');
        } else {
            divResposta.classList.add('especial');
            divResposta.classList.remove('pequeno');
        }

        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
    } catch (error) {
        console.error('Erro ao editar octogonal:', error);
    }
}

async function apagar(id) {
    try {
        let divResposta = document.querySelector('#mensagem');
        if (confirm('Quer apagar o #' + id + '?')) {
            let resposta = await fetch('/suportes/' + id, {
                method: 'delete',
            });

            let respostaJson = await resposta.json();
            let mensagem = respostaJson.mensagem;
            divResposta.innerText = traducoes['pt-BR'][mensagem];

            await listar();
        }
    } catch (error) {
        console.error('Erro ao apagar octogonal:', error);
    }
}
