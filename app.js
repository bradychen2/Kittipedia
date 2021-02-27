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
  const searchBy = req.query.searchBy // Search category
  const keywords = req.query.keywords
  console.log(req.query)
  // Construct regular expression with case insensitive 'i' for search
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
  let naturalValue = 0
  let hairlessValue = 0
  let shortLegsValue = 0
  const checkbox = req.query

  if (checkbox.natural === 'on') {
    naturalValue = 1
  }
  if (checkbox.hairless === 'on') {
    hairlessValue = 1
  }
  if (checkbox.short_legs === 'on') {
    shortLegsValue = 1
  }
  // If no checkbox is checked, redirect to breeds page 
  if (Object.keys(checkbox).length === 0) {
    res.redirect('/cats/breeds')
  } else {
    // If any filter condition, find data and render the page
    return Breed
      .find({
        natural: naturalValue,
        hairless: hairlessValue,
        short_legs: shortLegsValue
      })
      .lean()
      .then(breeds => {
        // Send checkbox condition for checkbox-rendering
        res.render('breeds', { breeds, checkbox })
      })
      .catch(err => {
        res.send(err)
      })
  }
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

// Go to create page
app.get('/cats/create', (req, res) => {
  // Find one Breed object and pass to hbs
  // in order to render number-type input.
  return Breed.findOne()
    .then(breed => {
      res.render('create', { breed: breed })
    })
    .catch(err => {
      console.log(err)
    })
})

app.post('/cats', (req, res) => {
  const newBreedInfo = req.body
  return Breed.create(newBreedInfo)
    .then(() => res.redirect('/cats/breeds'))
    .catch(err => {
      console.log(err)
    })
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})