const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
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
app.use(session({
  secret: 'superKittie',
  resave: true,
  saveUninitialized: false,
}))

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
      req.session.breeds = breeds
      req.session.display = 'card'
      res.render('breeds', { breeds })
    })
    .catch(err => {
      console.log(err)
    })
})

// Switch view to list
app.get('/cats/breeds/list', (req, res) => {
  const prop = req.session.prop
  if (req.session.breeds === undefined) {
    Breed.find()
      .lean()
      .then(breeds => {
        req.session.breeds = breeds
        req.session.display = 'list'
        res.render('breedsList', { breeds, prop })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    req.session.display = 'list'
    res.render('breedsList', { breeds: req.session.breeds, prop })
  }
})

// Switch view to card
app.get('/cats/breeds/card', (req, res) => {
  const prop = req.session.prop
  if (req.session.breeds === undefined) {
    Breed.find()
      .lean()
      .then(breeds => {
        req.session.breeds = breeds
        req.session.display = 'card'
        res.render('breeds', { breeds, prop })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    req.session.display = 'card'
    res.render('breeds', { breeds: req.session.breeds, prop })
  }
})

// Sort breeds by property
app.get('/cats/sort', (req, res) => {
  const prop = req.query.property
  req.session.prop = prop
  const display = req.session.display

  if (req.session.breeds) {
    const breeds = req.session.breeds

    // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    // Sort breeds list by prop
    breeds.sort((a, b) => (a[prop] < b[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0))
    // Store sorted list into session
    req.session.breeds = breeds

    // Render by original display (card or list)
    if (display === 'card') {
      res.render('breeds', { breeds, prop })
    } else {
      res.render('breedsList', { breeds, prop })
    }
  } else { // If session no breeds data, find in db
    return Breed.find()
      .sort({ [prop]: 'desc' }) // Sort by prop
      .lean()
      .then(breeds => {
        req.session.breeds = breeds
        // Render by original display (card or list)
        if (display === 'card') {
          res.render('breeds', { breeds, prop })
        } else {
          res.render('breedsList', { breeds, prop })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
})


// Search in Breeds page
app.get('/cats/search', (req, res) => {
  const searchBy = req.query.searchBy // Search category
  const keywords = req.query.keywords
  console.log(req.query)
  // Construct regular expression with case insensitive 'i' for search
  return Breed.find({ [searchBy]: new RegExp(keywords, 'i') })
    .sort({ [searchBy]: 'asc' })
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
  searchCondition = {}
  const checkbox = req.query

  if (checkbox.natural === 'on') {
    let naturalValue = 1
    searchCondition.natural = naturalValue
  }
  if (checkbox.hairless === 'on') {
    let hairlessValue = 1
    searchCondition.hairless = hairlessValue
  }
  if (checkbox.short_legs === 'on') {
    let shortLegsValue = 1
    searchCondition.short_legs = shortLegsValue
  }
  // If no checkbox is checked, redirect to breeds page 
  if (Object.keys(checkbox).length === 0) {
    res.redirect('/cats/breeds')
  } else {
    // If any search condition, find data and render the page
    return Breed
      .find(searchCondition)
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

// Create new breed
app.post('/cats', (req, res) => {
  // Check Boolean properties
  if (req.body.natural) {
    req.body.natural = true
  } else {
    req.body.natural = false
  }
  if (req.body.hairless) {
    req.body.hairless = true
  } else {
    req.body.hairless = false
  }
  if (req.body.short_legs) {
    req.body.short_legs = true
  } else {
    req.body.short_legs = false
  }

  const newBreedInfo = req.body
  // Create new breed data and redirect to breeds page
  return Breed.create(newBreedInfo)
    .then(() => res.redirect('/cats/breeds'))
    .catch(err => {
      console.log(err)
    })
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})