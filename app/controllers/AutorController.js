class AutorController {
    autor(req, res) {
        let autor = {
            nome: 'Jeovah Mario Oliveira Andrade',
            formacoes: ['Técnico em Informática'],
            experienciaProfissional: [
                {
                    cargo: 'Estagiário',
                    departamento: 'IFCE',
                    ano: 2022
                }
            ]
        };

        res.render('sobre', { autor });
    }
}

module.exports = AutorController;
