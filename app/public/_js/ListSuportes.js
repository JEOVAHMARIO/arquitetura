export default {
    props: {
        suportes: Array,
    },
    setup(props, { emit }) {
        const suportes = Vue.ref(props.suportes);

        function selecionar(suporte) {
            //emit('selecionado', suporte);
            this.$router.push('/detalhes/' + suporte.id);
        }

        return {
            suportes,
            selecionar
        };
    },
    template: `
    <div>
        <h2>Lista</h2>
        <div v-for="suporte of suportes">
            {{ suporte.nome }}
            <button @click="selecionar(suporte);">Selecionar</button>
        </div>
    </div>
    `,
};
