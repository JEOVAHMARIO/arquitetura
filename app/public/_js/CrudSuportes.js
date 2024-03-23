export default {
    props: {
        suportes: Array,
    },
    setup(props, { emit }) {
        const nome = Vue.ref('');
        const suportes = Vue.ref(props.suportes || []);

        function inserir() {
            suportes.value.push({ id: suportes.value.length + 1, nome: nome.value });
        }

        function selecionar(suporte) {
            emit('selecionado', suporte);
        }

        return {
            nome,
            suportes,
            inserir,
            selecionar
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
                        <button @click="editar(1);">Editar</button>
                        <button @click="apagar(1);">Apagar</button>
                        <button @click="selecionar(suporte);">Selecionar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
};
