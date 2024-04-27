export default {
    props: {
        usuarios: Array,
    },
    template: `
    <div>
        <h2>Lista de Usuários</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="usuario in usuarios" :key="usuario.id">
                    <td>{{ usuario.id }}</td>
                    <td>{{ usuario.nome }}</td>
                    <td>{{ usuario.email }}</td>
                    <td>
                        <button @click="editar(usuario.id)">Editar</button>
                        <button @click="apagar(usuario.id)">Apagar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    methods: {
        async editar(id) {
            try {
                const response = await axios.get(`/usuarios/${id}`);
                const usuario = response.data;
    
                this.$emit('editar-usuario', usuario);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        },
        async apagar(id) {
            try {
                const response = await axios.delete(`/usuarios/${id}`);
    
                console.log('Usuário apagado com sucesso.');
    
                this.$emit('usuario-apagado', id);
            } catch (error) {
                console.error('Erro ao apagar usuário:', error);
            }
        }
    }
};