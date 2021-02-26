const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Breed = require('./models/breed')
const Image = require('./models/image')

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
app.use(bodyParser.urlencoded({ extended: true }))


db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// Homepage
app.get('/', (req, res) => {
  res.render('index')
})

// Go to Breeds page
app.get('/cats/breeds', (req, res) => {
  Breed.find()
    .lean()
    .then(breeds => {
      res.render('breeds', { breeds })
    })
    .catch(err => {
      console.log(err)
    })
})


// Sort breeds by property
app.get('/cats/sort', (req, res) => {
  const prop = req.query.property
  console.log(prop)
  return Breed.find()
    .sort({ [prop]: 'desc' })
    .lean()
    .then(breeds => {
      res.render('breeds', { breeds })
    })
    .catch(err => {
      console.log(err)
    })
})


// Search in Breed page
app.get('/cats/search', (req, res) => {
  const keywords = req.query.keywords
  console.log(req.query)
  return Breed.find({ name: new RegExp(keywords, 'i') })
    .sort({ name: 'asc' })
    .lean()
    .then(breeds => {
      res.render('breeds', { breeds })
    })
    .catch(err => {
      console.log(err)
    })
})


// Go to Gallery page
app.get('/cats/gallery', (req, res) => {
  Image.find()
    .lean()
    .then(images => {
      res.render('gallery', { images })
    })
    .catch(err => {
      console.log(err)
    })
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})