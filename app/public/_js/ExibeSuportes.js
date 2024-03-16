export default {
    props: {
      suportes: Array
    },
    methods: {
      exibirDetalhes(suporte) {
        this.$emit('exibir-detalhes', suporte);
      },
      editar(index) {
        this.$emit('editar', index);
      },
      apagar(index) {
        this.$emit('apagar', index);
      },
      selecionar(suporte) {
        this.$emit('selecionar', suporte);
      }
    }
  }
  