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
                octogonal: {
                    ...octogonal.dataValues,
                    area: octogonal.calcularArea(),
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
            let octogonais = await this.suporteDao.listar();
            let dados = octogonais.map(octogonal => ({
                ...octogonal.dataValues,
                area: octogonal.calcularArea(),
            }));

            res.json(dados);
        } catch (error) {
            res.status(500).json({
                mensagem: `Erro ao listar octogonais: ${error.message}`,
            });
        }
    }

    async inserir(req, res, next) {
        try {
            const { nome, lado } = req.body;

            const octogonal = await this.suporteDao.inserir({
                nome,
                lado: parseFloat(lado),
            });

            res.json({
                octogonal: {
                    ...octogonal.dataValues,
                    area: octogonal.calcularArea(),
                },
                mensagem: 'mensagem_suporte_cadastrado',
            });
        } catch (error) {
            console.error('Erro ao inserir octogonal:', error);
            res.status(400).json({ mensagem: 'Erro ao inserir octogonal.' });
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
            console.error('Erro ao alterar octogonal:', error);
            res.status(400).json({ mensagem: 'Erro ao alterar octogonal.' });
        }
    }

    async apagar(req, res) {
        try {
            const { id } = req.params;

            await this.suporteDao.apagar(id);

            res.json({ mensagem: 'mensagem_suporte_apagado', id });
        } catch (error) {
            console.error('Erro ao apagar octogonal:', error);
            res.status(400).json({ mensagem: 'Erro ao apagar octogonal.' });
        }
    }
}

module.exports = SuporteController;
