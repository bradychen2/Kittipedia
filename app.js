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
  const search = req.session.search
  const checkbox = req.session.checkbox

  if (req.session.breeds) {
    req.session.display = 'list'
    res.render('breedsList', {
      breeds: req.session.breeds,
      prop,
      search,
      checkbox
    })
  } else {
    Breed.find()
      .lean()
      .then(breeds => {
        req.session.breeds = breeds
        req.session.display = 'list'
        res.render('breedsList', { breeds, prop, search, checkbox })
      })
      .catch(err => {
        console.log(err)
      })
  }
})

// Switch view to card
app.get('/cats/breeds/card', (req, res) => {
  const prop = req.session.prop
  const search = req.session.search
  const checkbox = req.session.checkbox

  if (req.session.breeds) {
    req.session.display = 'card'
    res.render('breeds', {
      breeds: req.session.breeds,
      prop,
      search,
      checkbox
    })
  } else {
    Breed.find()
      .lean()
      .then(breeds => {
        req.session.breeds = breeds
        req.session.display = 'card'
        res.render('breeds', { breeds, prop, search, checkbox })
      })
      .catch(err => {
        console.log(err)
      })
  }
})

// Sort breeds by property
app.get('/cats/sort', (req, res) => {
  const prop = req.query.property
  req.session.prop = prop
  const display = req.session.display
  const search = req.session.search
  const checkbox = req.session.checkbox

  if (req.session.breeds) {
    const breeds = req.session.breeds

    // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    // Sort breeds list by prop
    breeds.sort((a, b) => (a[prop] < b[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0))
    // Store sorted list into session
    req.session.breeds = breeds

    // Render by original display (card or list)
    if (display === 'list') {
      res.render('breedsList', { breeds, prop, search, checkbox })
    } else {
      console.log(breeds)
      res.render('breeds', { breeds, prop, search, checkbox })
    }
  } else { // If session no breeds data, find in db
    return Breed.find()
      .sort({ [prop]: 'desc' }) // Sort by prop
      .lean()
      .then(breeds => {
        req.session.breeds = breeds
        // Render by original display (card or list)
        if (display === 'list') {
          res.render('breedsList', { breeds, prop, search, checkbox })
        } else {
          console.log(breeds)
          res.render('breeds', { breeds, prop, search, checkbox })
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
  req.session.search = searchBy
  console.log(req.query)
  // Construct regular expression with case insensitive 'i' for search
  return Breed.find({ [searchBy]: new RegExp(keywords, 'i') })
    .sort({ [searchBy]: 'asc' })
    .lean()
    .then(breeds => {
      req.session.breeds = breeds  // Remember search results
      res.render('breeds', { breeds, keywords, search: req.session.search })
    })
    .catch(err => {
      console.log(err)
    })
})

// Filter in Breeds page
app.get('/cats/filter', (req, res) => {
  const search = req.session.search
  const prop = req.session.prop
  const display = req.session.display
  const checkbox = req.query
  req.session.checkbox = checkbox

  filterCondition = {}
  for (let prop in checkbox) {
    filterCondition[prop] = 1
  }

  // If session has breeds and checkbox is not empty
  if (req.session.breeds &&
    Object.keys(filterCondition).length !== 0) {
    let breeds = req.session.breeds

    for (let prop in filterCondition) {
      breeds = breeds.filter(breed => {
        if (breed[prop] === true) {
          return breed
        }
      })
    }
    req.session.breeds = breeds

    if (display === 'list') {
      // Send checkbox condition for checkbox-rendering
      res.render('breedsList', { breeds, checkbox, prop, search })
    } else {
      res.render('breeds', { breeds, checkbox, prop, search })
    }
  } else {
    // No breeds data in session, find from db
    return Breed
      .find(filterCondition)
      .lean()
      .then(breeds => {
        req.session.breeds = breeds

        if (display === 'list') {
          res.render('breedsList', { breeds, checkbox, prop, search })
        }
        res.render('breeds', { breeds, checkbox, prop, search })
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

// Gallery filter
app.get('/cats/gallery/filter', (req, res) => {
  const filterBy = req.query.filterBy
  req.session.filterBy = filterBy
  let filterCondition = { jpg: 'undefined', png: 'undefined', gif: 'undefined' }

  switch (filterBy) {
    case 'all':
      filterCondition.jpg = 'jpg'
      filterCondition.png = 'png'
      filterCondition.gif = 'gif'
      break
    case 'jpg':
      filterCondition.jpg = 'jpg'
      break
    case 'png':
      filterCondition.png = 'png'
      break
    case 'static':
      filterCondition.jpg = 'jpg'
      filterCondition.png = 'png'
      break
    case 'gif':
      filterCondition.gif = 'gif'
      break
  }

  console.log(filterCondition)
  return Image
    .find({
      url: {
        $in: [
          new RegExp(filterCondition.jpg),
          new RegExp(filterCondition.png),
          new RegExp(filterCondition.gif)
        ]
      }
    })
    .lean()
    .then(images => {
      res.render('gallery', { images, filterBy })
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