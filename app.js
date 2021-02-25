const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/kittipedia', {
  useNewUrlParser: true, useUnifiedTopology: true
})
const db = mongoose.connection

const app = express()
const port = 3000

app.engine('hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
  }))
app.set('view engine', 'hbs')

app.use(express.static('./public'))

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})