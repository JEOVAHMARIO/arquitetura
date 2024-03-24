// public/_js/suporte.js

async function calcularArea() {
    console.log('teste1');
    try {
        let inputNome = document.querySelector('[name=nome]');
        let nome = inputNome.value;
        let inputLado = document.querySelector('[name=lado]');
        let lado = parseFloat(inputLado.value);
        let inputIdPapel = document.querySelector('[name=id_papel]');
        let idPapel = parseFloat(inputIdPapel.value);
        let inputSenha = document.querySelector('[name=senha]');
        let senha = inputSenha.value;

        let suporte = { nome, lado, id_papel: idPapel, senha };

        if (idPapel === 0 || isNaN(idPapel)) {
            await inserir(suporte);
        } else {
            await editar(suporte, idPapel); 
        }

        exibirDadosFormulario(nome, lado, idPapel, senha);
    } catch (error) {
        console.error('Erro ao processar área:', error);
    }
}


async function inserir(suporte) {
    try {
        let divResposta = await getOrCreateMensagemDiv();

        let dados = new URLSearchParams(suporte);

        let resposta = await fetch('/suportes', {
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
        console.error('Erro ao inserir suporte:', error);
    }
}

function exibirDadosFormulario(nome, lado, idPapel, senha) {
    let dadosFormularioDiv = document.querySelector('#dadosFormulario');
    dadosFormularioDiv.innerHTML = `<p>Dados do Formulário:</p>
                                    <ul>
                                        <li><strong>Nome:</strong> ${nome}</li>
                                        <li><strong>Lado:</strong> ${lado}</li>
                                        <li><strong>ID Papel:</strong> ${idPapel}</li>
                                        <li><strong>Senha:</strong> ${senha}</li>
                                    </ul>`;
}

async function getOrCreateMensagemDiv() {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));

    let divResposta = document.querySelector('#mensagem');

    if (!divResposta) {
        divResposta = document.createElement('div');
        divResposta.id = 'mensagem';
        document.body.appendChild(divResposta);
    }

    return divResposta;
}

async function editar(octogonal, id) {
    try {
        let divResposta = await getOrCreateMensagemDiv();

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
        divOctogonais.innerText = 'Erro ao obter a lista de suportes';
    }
}


async function apagar(id) {
    try {
        let divResposta = await getOrCreateMensagemDiv();
        if (confirm('Quer apagar o suporte #' + id + '?')) {
            let resposta = await fetch('/suportes/' + id, {
                method: 'delete',
            });

            let respostaJson = await resposta.json();
            let mensagem = respostaJson.mensagem;
            divResposta.innerText = traducoes['pt-BR'][mensagem];

            await listar();
        }
    } catch (error) {
        console.error('Erro ao apagar suporte:', error);
    }
}
