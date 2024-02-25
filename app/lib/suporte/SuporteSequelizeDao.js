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
        this.Octogonal = Octogonal.init(this.sequelize);

        (async () => {
            try {
                await this.Octogonal.sync();
                console.log('Tabela criada com sucesso!');
            } catch (error) {
                console.error('Erro ao criar tabela:', error);
            }
        })();
    }

    async listar() {
        return this.Octogonal.findAll();
    }

    async inserir(octogonal) {
        this.validar(octogonal);
        octogonal.senha = bcrypt.hashSync(octogonal.senha, 10);

        return this.Octogonal.create(octogonal);
    }

    async alterar(id, octogonal) {
        this.validar(octogonal, true);
        if (!octogonal) {
            throw new Error('Objeto octogonal é nulo ou indefinido');
        }

        let obj = { ...octogonal.dataValues };
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key];
            }
        });

        await this.Octogonal.update(obj, { where: { id: id } });
    }

    async apagar(id) {
        return this.Octogonal.destroy({ where: { id: id } });
    }

    validar(octogonal, permitirSenhaEmBranco = false) {
        if (!octogonal.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!permitirSenhaEmBranco && !octogonal.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (octogonal.lado < 0) {
            throw new Error('mensagem_lado_invalido');
        }
    }
    

    autenticar(nome, senha) {
        return new Promise((resolve, reject) => {
        });
    }
}

module.exports = SuporteSequelizeDao;
