const utils = require('../lib/utils');
const express = require('express');

class SuporteController {
    constructor(suporteDao) {
        this.suporteDao = suporteDao;
    }

    getRouter() {
        const rotas = express.Router();
        rotas.get('/', (req, res) => {
            this.listar(req, res);
        });

        rotas.put('/:id', async (req, res) => {
            await this.alterar(req, res);
        });

        rotas.delete('/:id', async (req, res) => {
            await this.apagar(req, res);
        });

        rotas.post('/', async (req, res, next) => {
            await this.inserir(req, res, next);
        });

        return rotas;
    }

    index(req, res) {
        res.render('index');
    }

    async area(req, res) {
        try {
            const { nome, lado } = req.body;

            const octogonal = await this.suporteDao.inserir({
                nome,
                lado: parseFloat(lado),
            });

            res.json({
                suporte: {
                    ...suporte.dataValues,
                    area: suporte.area(),
                },
                mensagem: 'mensagem_suporte_cadastrado',
            });
        } catch (error) {
            console.error('Erro ao processar área:', error);
            res.status(400).json({ mensagem: 'Erro ao processar área.' });
        }
    }

    async listar(req, res) {
        try {
            console.log('Entrando na função listar');
            let suportes = await this.suporteDao.listar();
            console.log('Suportes:', suportes);
    
            // Converta os suportes para o formato esperado antes de enviar como resposta
            let dados = suportes.map(suporte => ({
                id: suporte._id, // ou utilize suporte.id dependendo do que está no seu modelo
                nome: suporte.nome,
                lado: suporte.lado,
                // outras propriedades, se necessário
            }));
    
            res.json(dados);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensagem: 'Erro ao listar suportes' });
        }
    }
    
    
    
    
    async inserir(req, res, next) {
        try {
            const { nome, lado } = req.body;

            const suporte = await this.suporteDao.inserir({
                nome,
                lado: parseFloat(lado),
            });

            res.json({
                suporte: {
                    ...suporte.dataValues,
                    area: suporte.area(),
                },
                mensagem: 'mensagem_suporte_cadastrado',
            });
        } catch (error) {
            console.error('Erro ao inserir suporte:', error);
            res.status(400).json({ mensagem: 'Erro ao inserir suporte.' });
            // Se você estiver usando middleware de erro global, você pode remover o next()
            // next(error);
        }
    }

    async alterar(req, res) {
        try {
            const { id } = req.params;
            const { nome, lado } = req.body;

            await this.suporteDao.alterar(id, {
                nome,
                lado: parseFloat(lado),
            });

            res.json({ mensagem: 'mensagem_suporte_alterado' });
        } catch (error) {
            console.error('Erro ao alterar suporte:', error);
            res.status(400).json({ mensagem: 'Erro ao alterar suporte.' });
        }
    }

    async apagar(req, res) {
        try {
            const { id } = req.params;

            await this.suporteDao.apagar(id);

            res.json({ mensagem: 'mensagem_suporte_apagado', id });
        } catch (error) {
            console.error('Erro ao apagar suporte:', error);
            res.status(400).json({ mensagem: 'Erro ao apagar suporte.' });
        }
    }
}

module.exports = SuporteController;
