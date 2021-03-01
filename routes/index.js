const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const breeds = require('./modules/breeds')
const gallery = require('./modules/gallery')
const create = require('./modules/create')
const notFound = require('./modules/notFound')

router.use('/', home)
router.use('/cats/breeds', breeds)
router.use('/cats/gallery', gallery)
router.use('/cats/create', create)
router.use('/cats/notFound', notFound)

module.exports = router