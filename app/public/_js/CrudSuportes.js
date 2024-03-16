export default {
    props: {
        nomes: Array,
        nome: String
    },
    data() {
        return {
            nome: '',
            lado: '',
            idPapel: '',
            senha: '',
            respostas: [],
            ultimaResposta: null,
            tipo: '',
            area: 0,
            mostrarCartas: false,
            mostrarBotaoListar: false
        };
    },
    methods: {
        inserir() {
            this.calcularArea();
            const novaResposta = {
                nome: this.nome,
                lado: this.lado,
                idPapel: this.idPapel,
                senha: this.senha,
                area: this.area,
                tipo: this.tipo
            };

            this.respostas.push(novaResposta);
            this.ultimaResposta = novaResposta;
            this.limparCampos();
            this.mostrarBotaoListar = true;
        },
        listarCartas() {
            this.mostrarCartas = true;
        },
        editar(index) {
            if (this.validarIndice(index)) {
                let respostaEditavel = this.respostas[index - 1];
                this.preencherCamposParaEdicao(respostaEditavel);
                this.removerResposta(index - 1);
                this.ultimaResposta = null;
            } else {
                console.log('ID inválido para edição.');
            }
        },
        apagar(index) {
            if (this.validarIndice(index)) {
                const respostaRemovida = this.respostas.splice(index - 1, 1)[0];
                console.log('Resposta removida:', respostaRemovida);
            } else {
                console.log('ID inválido para remoção.');
            }
        },
        adicionarResposta(resposta) {
            this.respostas.push(resposta);
            this.ultimaResposta = resposta;
        },
        preencherCamposParaEdicao(resposta) {
            this.nome = resposta.nome;
            this.lado = resposta.lado;
            this.idPapel = resposta.idPapel;
            this.senha = resposta.senha;
        },
        removerResposta(index) {
            this.respostas.splice(index, 1);
        },
        limparCampos() {
            this.nome = '';
            this.lado = '';
            this.idPapel = '';
            this.senha = '';
        },
        validarIndice(index) {
            return index >= 1 && index <= this.respostas.length;
        },
        calcularArea() {
            if (!isNaN(this.lado) && this.lado >= 0) {
                this.area = 2 * this.lado * this.lado * (1 + Math.sqrt(2));
                this.area = parseFloat(this.area.toFixed(2));
                this.tipo = this.area < 20 ? 'pequeno' : 'especial';
            } else {
                this.area = 0;
                this.tipo = '';
            }
        },
        selecionar(nome) {
            this.$emit('selecionado', nome);
        }
    },
    template: `
    <div class="card-container">
        <form method="post" @submit.prevent="inserir">
            <label>
                <span>Nome</span>
                <input name="nome" v-model="nome">
            </label>
            <label>
                <span>Lado</span>
                <input name="lado" v-model="lado">
            </label>
            <label>
                <span>ID papel</span>
                <input name="id_papel" type="number" v-model="idPapel">
            </label>
            <label>
                <span>Senha</span>
                <input name="senha" type="password" v-model="senha">
            </label>
            <button type="submit">Ok</button>
            <button @click="listarCartas" v-show="mostrarBotaoListar">Listar</button>
        </form>

        <div class="cards-wrapper" v-if="mostrarCartas">
            <div v-for="(resposta, index) in respostas" :key="index" class="card">
                <h3>{{ resposta.nome }}</h3>
                <p>Lado: {{ resposta.lado }}</p>
                <p>Senha: {{ resposta.senha }}</p>
                <p>ID_Papel: {{ resposta.idPapel }}</p>
                <p>Tipo: {{ resposta.tipo }}</p>
                <button @click="editar(index + 1)">Editar</button>
                <button @click="apagar(index + 1)">Apagar</button>
                <button @click="selecionar(resposta.nome)">Selecionar</button>
            </div>
        </div>
    </div>
    `
}
