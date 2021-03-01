const express = require('express')
const router = express.Router()

// No Result
router.get('/', (req, res) => {
  const prop = req.session.prop
  const search = req.session.search
  const checkbox = req.session.checkbox
  const breeds = req.session.breeds
  res.render('notFound', { breeds, prop, search, checkbox })
})

module.exports = router