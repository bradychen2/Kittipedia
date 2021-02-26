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


// Search in Breeds page
app.get('/cats/search', (req, res) => {
  const searchBy = req.query.searchBy
  const keywords = req.query.keywords
  console.log(req.query)
  return Breed.find({ [searchBy]: new RegExp(keywords, 'i') })
    .sort({ name: 'asc' })
    .lean()
    .then(breeds => {
      res.render('breeds', { breeds, searchBy })
    })
    .catch(err => {
      console.log(err)
    })
})

// Filter in Breeds page
app.get('/cats/filter', (req, res) => {
  let natural = 0
  let hairless = 0
  let short_legs = 0
  let indoor = 0
  if (req.query.natural === 'on') {
    natural = 1
  }
  if (req.query.hairless === 'on') {
    hairless = 1
  }
  if (req.query.short_legs === 'on') {
    short_legs = 1
  }
  if (req.query.indoor === 'on') {
    indoor = 1
  }
  return Breed
    .find({
      natural: new RegExp(natural),
      hairless: new RegExp(hairless),
      short_legs: new RegExp(short_legs),
      indoor: new RegExp(indoor)
    })
    .lean()
    .then(breeds => {
      res.render('breeds', breeds)
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