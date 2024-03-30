export default {
    props: {
        suportes: Array,
        nome2: String
    },
    setup(props, { emit }) {
        const suporte = Vue.ref({ nome: '', lado: '' });
        const suportes = Vue.ref(props.suportes || []);

        function inserir() {
            //suportes.value.push({id: suportes.value.length + 1, nome: nome.value});
            (async () => {
                let id = await adicionar({nome: suporte.value.nome, lado: suporte.value.lado})
                alert('Registro #' + id + ' adicionado!')
            })()
        }

        function selecionar(suporte) {
            emit('selecionado', suporte);
        }

        async function editar(suporte1) {
            suporte.value = suporte1;
        }

        async function apagar(id) {
            if (confirm('Quer apagar o #' + id + '?')) {
                await deletar(id);
                suportes.value = suportes.value.filter(item => item.id !== id);
                alert('Registro #' + id + ' apagado!');
            }
        }

        return {
            suporte,
            suportes,
            inserir,
            selecionar,
            editar,
            apagar,
        };
    },
    template: `
    <div class="card-container">
        <form @submit.prevent="inserir">
            <label>
                <span>Nome</span>
                <input name="nome" v-model="suporte.nome">
            </label>
            <label>
                <span>Lado</span>
                <input name="lado" v-model="suporte.lado">
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
            <tbody>
                <tr v-for="suporte in suportes" :key="suporte.id">
                    <td>{{ suporte.id }}</td>
                    <td>{{ suporte.nome }}</td>
                    <td>{{ suporte.lado }}</td>
                    <td>
                        <button @click="editar(suporte)">Editar</button>
                        <button @click="apagar(suporte.id)">Apagar</button>
                        <button @click="selecionar(suporte)">Selecionar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
};