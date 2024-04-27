const Suporte = require("./Suporte");
const bcrypt = require('bcrypt');

class SuporteMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    
    listar() {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT o.id, o.nome, o.lado, p.nome as papel FROM suportes o JOIN papeis p ON o.id_papel = p.id', function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
    
                let suportes = linhas.map(linha => {
                    let { id, nome, lado, papel } = linha;
                    return new Suporte(id, nome, lado, papel);
                });
    
                resolve(suportes);
            });
        });
    }    

    procurarPorId(id) {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT o.id, o.nome, o.lado, p.nome as papel FROM suportes o JOIN papeis p ON o.id_papel = p.id WHERE e.id=?',
            [id], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
    
                let suportes = linhas.map(linha => {
                    let { id, nome, lado, papel } = linha;
                    return new Suporte(id, nome, lado, papel); 
                });
    
                resolve(suportes[0]);
            });
        });
    }

    inserir(suporte) {
        this.validar(suporte);
        suporte.senha = bcrypt.hashSync(suporte.senha, 10);
        
        return new Promise((resolve, reject) => {
            if (!this.pool) {
                reject('Erro: Conexão com o banco de dados não foi estabelecida.');
                return;
            }
            let sql = `INSERT INTO suportes (nome, lado, senha, id_papel) VALUES (?, ?, ?, ?);`;
            console.log({ sql }, suporte);
    
            this.pool.query(sql, [suporte.nome, suporte.lado, suporte.senha, 1], function (error, resultado, fields) {
                if (error) {
                    reject('Erro: ' + error.message);
                } else {
                    if (resultado.length > 0) {
                        let linha = resultado[0];
                        if (bcrypt.compareSync(suporte.senha, linha.senha)) {
                            const { nome, lado } = linha;
                            resolve(new suporte(nome, lado));
                        } else {
                            resolve(resultado.insertId);
                        }
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
    
    alterar(id, suporte) {
        this.validar(suporte);
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE suportes SET nome=?, lado=? WHERE id=?';
            this.pool.query(sql, [suporte.nome, suporte.lado, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                if (resultado.affectedRows > 0) {
                    resolve(new suporte(id, suporte.nome, suporte.lado, suporte.papel));
                } else {
                    resolve(null);
                }
            });
        });
    }

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM suportes WHERE id=?;`;
            this.pool.query(sql, [id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(id);
            });
        });
    }

    validar(suporte) {
        if (!suporte.nome) {
            throw new Error('mensagem_nome_em_branco');
        }
        if (suporte.lado < 0) {
            throw new Error('Lado do suporte não pode ser menor que 0');
        }
    }
    
    autenticar(nome, senha) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM suportes WHERE nome=?';
            this.pool.query(sql, [nome], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                for (let linha of linhas) {
                    console.log('autenticar', senha, linha);
                    if (bcrypt.compareSync(senha, linha.senha)) {
                        let { id, nome, lado, papel } = linha;
                        return resolve(new Suporte(id, nome, lado, papel));
                    }
                }
                return resolve(null);
            });
        });
    }
} 
module.exports = SuporteMysqlDao;
