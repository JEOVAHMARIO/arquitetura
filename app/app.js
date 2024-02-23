const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 3000;

// Middleware para registrar data, hora e rota de cada solicitação
app.use((req, res, next) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const requestInfo = `${currentDate} ${currentTime} - Rota: ${req.path}`;
  
  console.log(requestInfo);

  // Chame next() para passar para o próximo middleware ou rota
  next();
});

// Configuração do EJS e Body Parser
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota para processar o formulário e renderizar area.ejs
app.post('/area', (req, res) => {
    const nome = req.body.nome;
    const lado = parseFloat(req.body.lado);
  
    let isErro = false;
    let area = 0;
    let explanation = '';
  
    if (!isNaN(lado) && lado > 0) {
      area = 2 * Math.pow(lado, 2) * (1 + Math.sqrt(2));
      explanation = 'explicação personalizada aqui';
    } else {
      isErro = true; // Definir isErro como verdadeiro se o lado for inválido
    }
  
    res.render('area', { isErro, nome, lado, area, explanation });
});

// Rota para renderizar o resultado da área mesmo sem enviar o formulário
app.get('/area', (req, res) => {
    // Você pode definir valores padrão ou deixar em branco
    res.render('area', { isErro: false, nome: '', lado: 0, area: 0, explanation: '' });
});


// Rota para renderizar o index.ejs
app.get('/index', (req, res) => {
  res.render('index');
});

// Rota para renderizar o sobre.ejs
app.get('/sobre', (req, res) => {
  res.render('sobre', {
    autor: {
      nome: 'Jeovah Mário',
      formacoes: ['Tecnico em Informática', 'Cursando Administração'],
      experienciaProfissional: [
        { cargo: 'Auxiliar de Manutenção', departamento: 'IFCE', ano: 2020 },
        { cargo: 'Auxiliar Administrativo', departamento: 'ENEL', ano: 2021 }
      ]
    }
  });
});

// Middleware para lidar com rotas não encontradas
app.use((req, res) => {
    res.status(404).render('error404', { url: req.originalUrl });
  });
  

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
