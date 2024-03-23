export default {
    props: {
        suportes: Array,
    },
    setup(props, {emit}) {
        const route = VueRouter.useRoute();
        let id = route.params.id;
        const suporte = props.suportes.value.filter(e => { return e.id == id; })[0];
        return {
            suporte
        }
    },
    template: `
    <h2>Detalhes</h2>
    {{suporte.id}}
    {{suporte.nome}}
    `
}
