const { MongoClient, ObjectId } = require('mongodb');
const Suporte = require('./Suporte');
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

    async procurarPorId(id) {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const suporte = await collection.findOne({_id: new ObjectId(id)});
        return suporte;   
    }

    async inserir(suporte) {
        this.validar(suporte);
        
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        return await collection.insertOne(suporte);
    }

    async alterar(id, suporte) {
        this.validar(suporte);

        await this.conectar();
        const collection = this.db.collection(this.colecao);

        const resultado = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { nome: suporte.nome, lado: suporte.lado } }
        );

        if (resultado.matchedCount > 0) {
            return new suporte(id, suporte.nome, suporte.lado, suporte.papel);
        } else {
            return null;
        }
    }

    async apagar(id) {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const suporte = await collection.deleteOne({_id: new ObjectId(id)});
        return suporte;
    }

    validar(suporte) {
        if (!suporte.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (suporte.lado < 0) {
            throw new Error('Lado do suporte não pode ser menor que 0');
        }
    }
    
    async autenticar(nome, senha) {
        await this.client.connect();
        const database = this.client.db(this.banco);
        const collection = database.collection(this.colecao);
    
        const suporte = await collection.findOne({ nome });
        if (suporte && suporte.nome === nome) {
            return new Suporte(suporte.nome, suporte.lado, suporte._id);
        }
        return null;
    }    
}

module.exports = SuporteMongoDao;