require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const csurf = require('csurf')
const helmet = require('helmet')

const route = require('./route')
const middlewares = require('./src/middlewares/middlewares')

const app = express()

mongoose.connect(process.env.url_db)
.then(() => {
    app.emit('ready')
})
.catch(e => {
    console.log('erro')
})

const OptionsSession = session({
    secret: 'chave',
    store: new MongoStore({mongoUrl: process.env.url_db}),
    saveUninitialized: false,
    resave: false,
    cookie:{
        httpOnly: true,
        maxAge: 1000*60*60*24*7
    }
})

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(OptionsSession)
app.use(flash())
app.use(csurf())
// app.use(helmet()) // Causando muita dor de cabeça ao tentar usar o 'back'
// app.use(helmet.referrerPolicy({policy: ["origin", "unsafe-url"]})); 'back'
app.use(middlewares.padrao)
app.use(middlewares.checkcrufs)
app.use(middlewares.validate)
app.use(route)

app.on('ready', () => {
    app.listen(3333, () => {
        console.log('Ativado na porta 3333...')
    })
})