const Suporte = require("./Suporte");
const bcrypt = require('bcrypt');

class SuporteDao {
    constructor() {
        this.suportes = [];
    }

    listar() {
        return this.suportes;
    }

    inserir(suporte) {
        this.validar(suporte);
        suporte.senha = bcrypt.hashSync(suporte.senha, 10);
        this.suportes.push(suporte);
    }

    alterar(id, suporte) {
        this.validar(suporte);
        this.suportes[id] = suporte;
    }

    apagar(id) {
        this.suportes.splice(id, 1);
    }

    validar(suporte) {
        if (suporte.nome === '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (suporte.lado < 0) {
            throw new Error('mensagem_tamanho_invalido');
        }
    }

    autenticar(nome, senha) {
        for (let suporte of this.listar()) {
            if (suporte.nome === nome && bcrypt.compareSync(senha, suporte.senha)) {
                return suporte;
            }
        }
        return null;
    }
}

module.exports = SuporteDao;
