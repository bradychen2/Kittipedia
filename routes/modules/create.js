const express = require('express')
const router = express.Router()
const Breed = require('../../models/breed')

// Go to create page
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
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

module.exports = router