const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/kittipedia', {
  useNewUrlParser: true, useUnifiedTopology: true
})
const db = mongoose.connection

const app = express()
const port = 3000

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  res.send('app is running')
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})