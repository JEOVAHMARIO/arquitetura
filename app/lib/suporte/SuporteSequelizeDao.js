const bcrypt = require('bcrypt');
const { DataTypes, Model } = require('sequelize');

class Octogonal extends Model {
    static init(sequelize) {
        return super.init({
            nome: DataTypes.TEXT,
            lado: DataTypes.FLOAT,
            senha: DataTypes.TEXT,
            papel: DataTypes.TEXT,
        }, { sequelize });
    }

    calcularArea() {
        if (!isNaN(this.lado) && this.lado >= 0) {
            const area = 2 * this.lado * this.lado * (1 + Math.sqrt(2));
            return parseFloat(area.toFixed(2));
        } else {
            return 0;
        }
    }
}

class SuporteSequelizeDao {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.Suporte = Suporte.init(this.sequelize);

        (async () => {
            try {
                await this.Suporte.sync();
                console.log('Tabela criada com sucesso!');
            } catch (error) {
                console.error('Erro ao criar tabela:', error);
            }
        })();
    }

    async listar() {
        return this.Suporte.findAll();
    }

    async inserir(suporte) {
        this.validar(suporte);
        suporte.senha = bcrypt.hashSync(suporte.senha, 10);

        return this.Suporte.create(suporte);
    }

    async alterar(id, suporte) {
        this.validar(suporte, true);
        if (!suporte) {
            throw new Error('Objeto suporte é nulo ou indefinido');
        }

        let obj = { ...suporte.dataValues };
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
        });

        await this.Suporte.update(obj, { where: { id: id } });
    }

    async apagar(id) {
        return this.Suporte.destroy({ where: { id: id } });
    }

    validar(suporte, permitirSenhaEmBranco = false) {
        if (!suporte.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!permitirSenhaEmBranco && !suporte.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (suporte.lado < 0) {
            throw new Error('mensagem_lado_invalido');
        }
    }

    async autenticar(nome, senha) {
        let suporte = await this.Suporte.findOne({ where: { nome } });

        if (suporte && suporte.senha && bcrypt.compareSync(senha, suporte.senha)) {
            return suporte;
        }

        return suporte;
    }
}

module.exports = SuporteSequelizeDao;
