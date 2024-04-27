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
const UsuariosSequelizeDao = require('./lib/projeto/UsuariosSequelizeDao');
const UsuariosController = require('./controllers/UsuariosController');

const PORT = 3000;

app.set('view engine', 'ejs');

let suporteDao = new SuporteMongoDao(mongoClient);

let usuariosDao = new UsuariosSequelizeDao(sequelize);
let usuariosController = new UsuariosController(usuariosDao);
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

app.get('/editar', (req, res) => {
  pool.query('SELECT suportes.id, suportes.nome, suportes.lado, suportes.resumo FROM suportes JOIN categorias ON suportes.id_categoria=categorias.id ORDER BY nome, lado', [], function(erro, listagem) {
    if(erro){
      res.status(200).send(erro)
    }
    res.render('editar', {suportes: listagem});
  });
})

app.post('/editar/:id', (req, res) => {
  pool.query('UPDATE suportes SET titulo=?, autor=?, id_categoria=(SELECT id FROM categorias WHERE nome =?), resumo=? WHERE id=?', [req.body.titulo, req.body.autor, req.body.categoria, req.body.resumo, req.params.id], 

  function(erro) {
    if(erro){
      res.status(200).send(erro)
    } 
    res.redirect('/index');     
  });
})

app.get('/excluir', (req, res) => {
  pool.query('SELECT suportes.id, suportes.nome, suportes.lado, suportes.resumo FROM suportes JOIN categorias ON suportes.id_categoria=categorias.id ORDER BY nome, lado', [], function(erro, listagem) {
    if(erro){
      res.status(200).send(erro)
    }
    res.render('excluir', {suportes: listagem});
  });
})

app.delete('/excluir/:id', (req, res) => {
  pool.query('DELETE FROM suportes WHERE id = ?', [req.params.id], 
  function(erro) {
    if(erro){
      res.status(200).send(erro)
    }else{
      res.status(200).send('OK');
    }   
  });
})

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
