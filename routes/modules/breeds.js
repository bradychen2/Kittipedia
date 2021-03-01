const express = require('express')
const Breed = require('../../models/breed')
const router = express.Router()

// Go to Breeds page
router.get('/', (req, res) => {
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
router.get('/list', (req, res) => {
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
router.get('/card', (req, res) => {
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
router.get('/sort', (req, res) => {
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
router.get('/search', (req, res) => {
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
router.get('/filter', (req, res) => {
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

module.exports = router