async function listar() {
    try {
        let resposta = await fetch('/suportes');
        let suportes = await resposta.json();
        return suportes;
    } catch (error) {
        console.error('Erro ao listar suportes:', error);
        throw error;
    }
}

async function adicionar(suporte) {
    try {
        let dados = new URLSearchParams(suporte);
        console.log(dados);
        let resposta = await fetch('/suportes', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: dados,
        });
        if (resposta.status == 200) {
            return await resposta.json();
        } else {
            throw new Error(await resposta.text());
        }
    } catch (error) {
        console.error('Erro ao adicionar suporte:', error);
        throw error;
    }
}

async function deletar(id) {
    let resposta = await fetch('/suportes/' + id, {
        method: 'delete',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    });
    let respostaJson = await resposta.json();
}
