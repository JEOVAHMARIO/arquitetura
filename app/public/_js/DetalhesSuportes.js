export default {
    props: {
        suporte: Object
    },
    template: `
        <div class="detalhes-suporte">
            <h3>{{ suporte.nome }}</h3>
            <p>Lado: {{ suporte.lado }}</p>
            <p>ID Papel: {{ suporte.idPapel }}</p>
            <p>Senha: {{ suporte.senha }}</p>
        </div>
    `
}
