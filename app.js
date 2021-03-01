const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const Breed = require('./models/breed')
const Image = require('./models/image')
const routes = require('./routes')

mongoose.connect('mongodb://localhost/kittipedia', {
  useNewUrlParser: true, useUnifiedTopology: true
})
const db = mongoose.connection

const app = express()
const port = 3000

app.engine('hbs',
  exphbs({
    helpers: require('./public/handlebarsHelpers'),
    defaultLayout: 'main',
    extname: '.hbs'
  }))
app.set('view engine', 'hbs')

app.use(express.static('./public'))
app.use(session({
  secret: 'superKittie',
  resave: true,
  saveUninitialized: false,
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})