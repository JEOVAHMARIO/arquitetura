export default {
    props: {
      suporte: Object
    },
    template: `
      <div class="card-container">
        <div class="card">
          <h3>{{ suporte.nome }}</h3>
          <button @click="editarSuporte(suporte)">Editar</button>
          <button @click="apagarSuporte(suporte)">Apagar</button>
          <button @click="selecionarSuporte(suporte)">Selecionar</button>
        </div>
      </div>
    `,
    methods: {
      editarSuporte(suporte) {
        this.$emit('editar', suporte);
      },
      apagarSuporte(suporte) {
        this.$emit('apagar', suporte);
      },
      selecionarSuporte(suporte) {
        this.$emit('selecionar', suporte);
      }
    }
  }
