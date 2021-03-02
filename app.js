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

// 404 Not Found
app.use((req, res, next) => {
  res.status(404)

  if (req.accepts('html')) {
    res.render('404')
    return
  }
  if (req.accepts('json')) {
    res.json({ error: '404 - Not Found' })
    return
  }
  res.type('text/plain').send('404 - Not Found')
})

// 500 Server Error
app.use((err, req, res, next) => {
  console.error(err.stock)
  res.status(500)

  if (req.accepts('html')) {
    res.render('500')
    return
  }
  if (req.accepts('json')) {
    res.json({ error: '500 - Server Error' })
    return
  }
  res.type('plain/text').send('500 - Server Error')
})


app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`)
})