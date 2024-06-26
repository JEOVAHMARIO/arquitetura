const Usuario = require('./../lib/projeto/Usuario');
const express = require('express');

class UsuariosController {
    constructor(usuariosDao) {
        this.usuariosDao = usuariosDao;      
    }

    getRouter() {
        const rotas = express.Router();
        
        rotas.get('/', async (req, res) => {
            try {
                let usuarios = await this.listar(req, res);
                res.render('usuarios', {usuarios: usuarios});        
            } catch (error) {
                console.error('Erro ao listar usuários:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        rotas.delete('/:id', async (req, res) => {
            try {
                await this.apagar(req, res);
                res.json({ mensagem: 'Usuário apagado com sucesso' });
            } catch (error) {
                console.error('Erro ao apagar usuário:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        rotas.get('/cadastro', (req, res) => {
            res.render('cadastroUsuarios',{usuario:{}});
        });

        rotas.post('/cadastro', async (req, res) => {
            try {
                await this.inserir(req, res);
                res.redirect('/');
            } catch (error) {
                console.error('Erro ao inserir usuário:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        rotas.get('/editar', async (req, res) => {
            try {
                let usuarios = await this.listar(req, res);
                res.render('editarUsuarios',{usuarios:usuarios});
            } catch (error) {
                console.error('Erro ao listar usuários:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        rotas.get('/cadastro/:id', async (req, res) => {
            try {
                let id = req.params.id;
                let usuario = await this.getUser(id);
                res.render('cadastroUsuarios',{usuario:usuario});
            } catch (error) {
                console.error('Erro ao buscar usuário por ID:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        rotas.put('/cadastro/:id', async (req, res) => {
            try {
                await this.alterar(req, res);
                res.json({ mensagem: 'Usuário alterado com sucesso' });
            } catch (error) {
                console.error('Erro ao alterar usuário:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        rotas.get('/excluir', async (req, res) => {
            try {
                let usuarios = await this.listar(req, res);
                res.render('excluirUsuarios',{usuarios:usuarios});
            } catch (error) {
                console.error('Erro ao listar usuários:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });

        return rotas;
    }

    async getUser(id){
        let usuario = await Usuario.findOne({
            raw: true,
            where: {
                id: id,
            },   
        });
        return usuario;
    }

    async listar(req, res) {
        let usuarios = await this.usuariosDao.listar();
        let dados = usuarios.map(usuario => {
            return {
                ...usuario.dataValues
            };
        });
        return dados;
    }
    
    async inserir(req, res) {
        let usuario = await this.getUsuarioDaRequisicao(req);
        let id = await this.usuariosDao.inserir(usuario);
        usuario.id = id;
        return usuario;
    }

    async alterar(req, res) {
        let usuario = await this.getUsuarioDaRequisicao(req);
        let id = req.params.id;
        await this.usuariosDao.alterar(id, usuario);
    }
    
    async apagar(req, res) {
        let id = req.params.id;
        await this.usuariosDao.apagar(id);
    }

    async getUsuarioDaRequisicao(req) {
        let corpo = req.body;
        let usuario = Usuario.build({
            nome: corpo.nome,
            senha: corpo.senha,
            papel: corpo.papel
        });
        return usuario;
    }
}

module.exports = UsuariosController;
