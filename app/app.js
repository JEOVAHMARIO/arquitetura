const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const SuporteSequelizeDao = require('./lib/suporte/SuporteSequelizeDao');
const SuporteController = require('./controllers/SuporteController');
const AutorController = require('./controllers/AutorController');
const SuporteDao = require('./lib/suporte/SuporteDao');

const PORT = 3000;

const sequelize = new Sequelize(
  process.env.MARIADB_DATABASE,
  'root',
  process.env.MARIADB_PASSWORD,
  {
    host: 'bd',
    dialect: 'mysql'
  }
);

app.set('view engine', 'ejs');

let suporteDao = new SuporteSequelizeDao(sequelize);
let suporteController = new SuporteController(suporteDao);
let autorController = new AutorController();

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const requestInfo = `${currentDate} ${currentTime} - Rota: ${req.path}`;

  console.log(requestInfo);

  next();
});

app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/suportes', suporteController.getRouter());

app.use((req, res, next) => {
  res.locals.dadosPersonalizados = { chave: 'valor' };
  console.log('middleware 0')
  next();
});

app.get([
  '/',
  '/index'
  ], (req, res) => {
      console.log('custom', req.dadosPersonalizados); 
      suporteController.index(req, res)
});

app.get('/index', (req, res) => res.render('index'));
app.post('/suportes', (req, res) => suporteController.area(req, res));
app.get('/sobre', (req, res) => autorController.autor(req, res));

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
