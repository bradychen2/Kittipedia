// Modules
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')

// Models
const mongoose = require('./config/mongoose')
const Breed = require('./models/breed')
const Image = require('./models/image')

// Routes
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

// View Engine
app.engine('hbs',
  exphbs({
    helpers: require('./public/handlebarsHelpers'),
    defaultLayout: 'main',
    extname: '.hbs'
  }))
app.set('view engine', 'hbs')

// Middleware
app.use(express.static('./public'))
app.use(session({
  secret: 'superKittie',
  resave: true,
  saveUninitialized: false,
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)


app.use((req, res) => {
  res.type('text/plain')
  res.status(404)
  res.send('404 - Not Found')
})

app.use((err, req, res, next) => {
  console.error(err.stock)
  res.type('plain/text')
  res.status(500)
  res.send('500 - Server Error')
})


app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`)
})