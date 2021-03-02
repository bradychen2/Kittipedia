const express = require('express')
const Breed = require('../../models/breed')
const router = express.Router()

// Go to Breeds page
router.get('/', (req, res) => {
  Breed.find()
    .lean()
    .then(breeds => {
      // Store all breeds data in session.breeds
      req.session.breeds = breeds
      // Set default view as 'card'
      req.session.display = 'card'
      res.render('breeds', { breeds })
    })
    .catch(err => {
      console.log(err)
    })
})

// Switch view to list
router.get('/list', (req, res) => {
  const prop = req.session.prop  // Property for sorting
  const search = req.session.search // Search by which category
  const checkbox = req.session.checkbox // Checkbox condition

  if (req.session.breeds) {
    // Set view as 'list'
    req.session.display = 'list'

    // session.breeds is {}, redirect to notFound page
    if (req.session.breeds.length === 0) {
      res.redirect('/cats/notFound')
    } else {
      // Use breedsList view, and pass in 
      // all information needed for rendering elements of func
      res.render('breedsList', {
        breeds: req.session.breeds,
        prop,
        search,
        checkbox
      })
    }
  } else {  // No session.breeds, find in db
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
    // Set view as 'card'
    req.session.display = 'card'

    // session.breeds is {}, redirect to notFound page
    if (req.session.breeds.length === 0) {
      res.redirect('/cats/notFound')
    } else {
      // Use breeds (card) view, and pass in 
      // all information needed for rendering elements of func
      res.render('breeds', {
        breeds: req.session.breeds,
        prop,
        search,
        checkbox
      })
    }
  } else {  // No session.breeds, find in db
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

// Sort breeds by chosen property
router.get('/sort', (req, res) => {
  const prop = req.query.property
  // Store chosen property to session
  // for rendering sort-option list
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
    // for keeping the order of display
    req.session.breeds = breeds

    // breeds = {}, redirect to notFound page
    if (breeds.length === 0) {
      res.redirect('/cats/notFound')
    } else {
      // Render by original type of view (card or list)
      if (display === 'list') {
        res.render('breedsList', { breeds, prop, search, checkbox })
      } else {  // If not list, display default view by 'card'
        console.log(breeds)
        res.render('breeds', { breeds, prop, search, checkbox })
      }
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
// Search will clean sorting and filter condition,
// and display new results found by the input keywords.
router.get('/search', (req, res) => {
  const searchBy = req.query.searchBy // Search category
  const keywords = req.query.keywords
  req.session.search = searchBy
  req.session.checkbox = {}  // Clean checkbox

  console.log(req.query)
  // Construct regular expression with case insensitive 'i' for search
  return Breed.find({ [searchBy]: new RegExp(keywords, 'i') })
    .sort({ [searchBy]: 'asc' })
    .lean()
    .then(breeds => {
      req.session.breeds = breeds  // Remember search results

      // breeds = {}, redirect to notFound page
      if (breeds.length === 0) {
        res.redirect('/cats/notFound')
      } else {
        res.render('breeds', { breeds, keywords, search: req.session.search })
      }
    })
    .catch(err => {
      console.log(err)
    })
})

// Filter in Breeds page
// Filter will filter the results depend on searching and sorting
router.get('/filter', (req, res) => {
  const search = req.session.search
  const prop = req.session.prop
  const display = req.session.display
  const checkbox = req.query
  // Store checkbox condition for
  // tracking and rendering checkbox
  req.session.checkbox = checkbox

  // Establish filter condition
  filterCondition = {}
  for (let prop in checkbox) {
    filterCondition[prop] = 1
  }

  // If session has breeds and checkbox is not empty
  if (req.session.breeds &&
    Object.keys(filterCondition).length !== 0) {
    let breeds = req.session.breeds

    // Use properties in filterCondition 
    // to filter existing breeds array
    for (let prop in filterCondition) {
      breeds = breeds.filter(breed => {
        if (breed[prop] === true) {
          return breed
        }
      })
    }
    req.session.breeds = breeds

    if (breeds.length === 0) {
      res.redirect('/cats/notFound')
    } else {
      if (display === 'list') {
        // Send checkbox condition for checkbox-rendering
        res.render('breedsList', { breeds, checkbox, prop, search })
      } else {
        res.render('breeds', { breeds, checkbox, prop, search })
      }
    }
  } else {
    // No breeds data in session, find from db
    // Or checkbox is empty, this will display all data
    return Breed
      .find(filterCondition)
      .lean()
      .then(breeds => {
        req.session.breeds = breeds

        if (breeds.length === 0) {
          res.redirect('/cats/notFound')
        } else {
          if (display === 'list') {
            res.render('breedsList', { breeds, checkbox, prop, search })
          } else {
            res.render('breeds', { breeds, checkbox, prop, search })
          }
        }
      })
      .catch(err => {
        res.send(err)
      })
  }
})

module.exports = router