const express = require('express')
const route = express.Router()

const exportados = require('./src/controllers/mainPages')
const loginController = require('./src/controllers/loginController')
const middlewares = require('./src/middlewares/middlewares')
const contatoController = require('./src/controllers/contatoControllers')

route.get('/home', middlewares.logado ,exportados.index)

// Rotas de Login e register e logout.
route.get('/login/index', loginController.loginPage)
route.post('/register', loginController.register)
route.post('/login', loginController.login)
route.get('/login/logout', loginController.logout)

// rotas de contato
route.get('/contato/index', middlewares.logado ,contatoController.contato)
route.post('/contato/register', middlewares.logado ,contatoController.register)
route.get('/contato/index/:id', middlewares.logado ,contatoController.editContato)
route.post('/contato/edit/:id', middlewares.logado ,contatoController.edit)
route.get('/contato/delete/:id', middlewares.logado, contatoController.delete)

module.exports = route