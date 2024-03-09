const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const { MongoClient } = require("mongodb");

const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.
MONGO_INITDB_ROOT_PASSWORD}@mongo`;   
const mongoClient = new MongoClient(uri);

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SEGREDO_JWT;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('verificação jwt' , jwt_payload);
    return done(null, jwt_payload);
}));

const SuporteMongoDao = require('./lib/suporte/SuporteMongoDao');
const SuporteController = require('./controllers/SuporteController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const SuporteDao = require('./lib/suporte/SuporteDao');

const PORT = 3000;

app.set('view engine', 'ejs');

let suporteDao = new SuporteMongoDao(mongoClient);
let suporteController = new SuporteController(suporteDao);
let autorController = new AutorController();
let authController = new AuthController(suporteDao);

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

app.get('/perfil' , passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res) => {
    res.json({'usuario': req.user});
})

app.get('/login', (req, res) => {
  authController.index(req, res);
});

app.post('/logar', (req, res) => {
  authController.logar(req, res);
});

app.get('/lista', async (req, res) => {
  let suportes = await suporteDao.listar();
  res.render('lista', {suportes});
});

app.get('*', (req, res, next) => {
  res.status(404).send('Nao encontrado')
});

app.use(function (err, req, res, next) {
  console.error('registrando erro: ', err.stack)
  res.status(500).send('Erro no servidor: ' + err.message);
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
