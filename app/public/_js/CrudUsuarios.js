export default {
    setup() {
        const nome = Vue.ref('');
        const email = Vue.ref('');
        const senha = Vue.ref('');

        function cadastrar() {
            const novoUsuario = {
                id: 0, 
                nome: nome.value,
                email: email.value,
                senha: senha.value
            };
            console.log('Novo usuário:', novoUsuario);
            nome.value = '';
            email.value = '';
            senha.value = '';
        }

        return {
            nome,
            email,
            senha,
            cadastrar
        };
    },

    template: `
    <section id="resposta">
        <form @submit.prevent="cadastrar">
            <br><br>
            <h2>Cadastro</h2><br>
            <input name="id" type="hidden" value="0">
            <label for="nome">Nome:</label><br>
            <input type="text" id="nome" name="nome" v-model="nome"><br>
            <label for="email">E-mail:</label><br>
            <input type="email" id="email" name="email" v-model="email"><br>
            <label for="senha">Senha:</label><br>
            <input type="password" id="senha" name="senha" v-model="senha"><br><br>
            <button type="submit" class="button button2">Registrar</button>
        </form>
    </section>
    `
}