export default {
    props: {
        suportes: Array,
        nome2: String
    },
    setup(props, { emit }) {
        const nome = Vue.ref('');
        const suportes = Vue.ref(props.suportes || []);

        function inserir() {
            //suportes.value.push({ id: suportes.value.length + 1, nome: nome.value });
            (async () => {
                let id = await adicionar({nome: nome.value, lado: 2})
                alert('Registro #' + id + ' adicionado!')

            })()
        }

        function selecionar(suporte) {
            emit('selecionado', suporte);
        }
        async function apagar(id) {
            if (confirm('Quer apagar o #' + id + '?')) {
                console.log('apagado', await deletar(id));
            }
        }

        return {
            nome,
            suportes,
            inserir,
            selecionar,
            apagar,
        };
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
        </form>

        <table>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Lado</th>
                <th></th>
            </tr>
            <tbody id="suportes">
                <tr v-for="suporte of suportes">
                    <td>{{ suporte.id }}</td>
                    <td>{{ suporte.nome }}</td>
                    <td>4</td>
                    <td>
                        <button @onclick="editar(suporte.id);">Editar</button>
                        <button @click="apagar(suporte.id);">Apagar</button>
                        <button @click="selecionar(suporte);">Selecionar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
};
