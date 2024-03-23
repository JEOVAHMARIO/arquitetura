export default {
    props: {
        suportes: Array
    },
    methods: {
        selecionar(suporte) {
            this.$emit('selecionar', suporte);
        },
        editar(index) {
            this.$emit('editar', index);
        },
        apagar(index) {
            this.$emit('apagar', index);
        }
    }
};
