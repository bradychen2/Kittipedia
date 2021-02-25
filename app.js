const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const axios = require('axios').default
const BASE_URL = "https://api.thecatapi.com"

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

axios.get(BASE_URL + '/v1/breeds')
  .then((res) => {
    breedsList = []
    breedsList.push(...res.data)
    console.log(breedsList)
  })
  .catch((err) => {
    console.log(err)
  })

app.get('/', (req, res) => {
  res.send('app is running')
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})