const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class SuporteMongoDao {
    constructor(client) {
        this.client = client;
        this.banco = 'arquitetura';
        this.colecao = 'suportes';
    }

    async conectar() {
        if (!this.client.isConnected()) {
            await this.client.connect();
        }
        this.db = this.client.db(this.banco);
    }

    async listar() {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const suportes = await collection.find().toArray();
        return suportes;
    }

    async inserir(octogonal) {
        this.validar(octogonal);

        octogonal.senha = bcrypt.hashSync(octogonal.senha, 10);
        
        await this.conectar();
        const collection = this.db.collection(this.colecao);

        const resultado = await collection.insertOne(octogonal);
        return resultado.insertedId;
    }

    async alterar(id, octogonal) {
        this.validar(octogonal);

        await this.conectar();
        const collection = this.db.collection(this.colecao);

        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { nome: octogonal.nome, lado: octogonal.lado } }
        );

        if (resultado.matchedCount > 0) {
            return new Octogonal(id, octogonal.nome, octogonal.lado, octogonal.papel);
        } else {
            return null;
        }
    }

    async apagar(id) {
        try {
            await this.conectar();
            const collection = this.db.collection(this.colecao);
            const objectId = new ObjectId(id);

            const result = await collection.deleteOne({ _id: objectId });

            if (result.deletedCount > 0) {
                console.log(`Suporte removido com sucesso: ${id}`);
                return true;
            } else {
                console.log(`Nenhum suporte foi removido: ${id}`);
                return false;
            }
        } catch (error) {
            console.error('Erro ao apagar suporte:', error);
            return false;
        }
    }

    validar(octogonal) {
        if (!octogonal.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (octogonal.lado < 0) {
            throw new Error('Lado do octogonal não pode ser menor que 0');
        }
    }
    
    async autenticar(nome, senha) {
        await this.conectar();
        const collection = this.db.collection(this.colecao);

        const suporte = await collection.findOne({ nome });

        if (suporte && bcrypt.compareSync(senha, suporte.senha)) {
            const { _id, nome, lado, papel } = suporte;
            return new Octogonal(_id, nome, lado, papel);
        }

        return null;
    }
}

module.exports = SuporteMongoDao;
