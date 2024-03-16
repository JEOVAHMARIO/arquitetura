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
        },
        listar() {
            if (this.respostas.length > 0) {
                console.log('Lista de Respostas:');
                this.respostas.forEach((resposta, index) => {
                    console.log(`#${index + 1}: Nome: ${resposta.nome}, Área: ${resposta.area} metros quadrados`);
                });
            } else {
                console.log('Nenhuma resposta cadastrada.');
            }
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
        <div>
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
            </form>

            <button @click="listar">Listar</button>
            
            <div v-if="ultimaResposta" :class="{'resposta': true, 'pequeno': ultimaResposta.tipo === 'pequeno', 'especial': ultimaResposta.tipo === 'especial' }">
                <p>Última Resposta:</p>
                <ul>
                    <li><strong>Nome:</strong> {{ ultimaResposta.nome }}</li>
                    <li><strong>Lado:</strong> {{ ultimaResposta.lado }}</li>
                    <li><strong>ID Papel:</strong> {{ ultimaResposta.idPapel }}</li>
                    <li><strong>Senha:</strong> {{ ultimaResposta.senha }}</li>
                    <li><strong>Área:</strong> {{ ultimaResposta.area }} metros quadrados</li>
                    <li><strong>Tipo:</strong> {{ ultimaResposta.tipo }}</li>
                </ul>
            </div>

            <div v-for="(resposta, index) in respostas" :key="index" :class="{'resposta': true, 'pequeno': resposta.tipo === 'pequeno', 'especial': resposta.tipo === 'especial' }">
                <p>Nova Resposta:</p>
                <ul>
                    <li><strong>Nome:</strong> {{ resposta.nome }}</li>
                    <li><strong>Lado:</strong> {{ resposta.lado }}</li>
                    <li><strong>ID Papel:</strong> {{ resposta.idPapel }}</li>
                    <li><strong>Senha:</strong> {{ resposta.senha }}</li>
                    <li><strong>Área:</strong> {{ resposta.area }} metros quadrados</li>
                    <li><strong>Tipo:</strong> {{ resposta.tipo }}</li>
                </ul>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Lado</th>
                        <th>Senha</th>
                        <th>ID_Papel</th> 
                        <th>Tipo</th>
                        <th>Ações</th> 
                    </tr>
                </thead>
                <tbody id="octogonais">
                    <tr v-for="(resposta, index) in respostas" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ resposta.nome }}</td>
                        <td>{{ resposta.lado }}</td>
                        <td>{{ resposta.senha }}</td>
                        <td>{{ resposta.idPapel }}</td> 
                        <td>{{ resposta.tipo }}</td>
                        <td>
                            <button @click="editar(index + 1)">Editar</button>
                            <button @click="apagar(index + 1)">Apagar</button>
                            <button @click="selecionar(resposta.nome)">Selecionar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
}