const express = require('express')
const router = express.Router()
const Image = require('../../models/image')

// Go to Gallery page
router.get('/', (req, res) => {
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
router.get('/filter', (req, res) => {
  const filterBy = req.query.filterBy
  // Store the filterBy in session to
  // tracking and rendering selection list
  req.session.filterBy = filterBy

  // Establish filter condition, the default string is 'undefined'
  let filterCondition = { jpg: 'undefined', png: 'undefined', gif: 'undefined' }

  // Set filterCondition depends on filterBy
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
  // Find in db by filterCondition
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

module.exports = router