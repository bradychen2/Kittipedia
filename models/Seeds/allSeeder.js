const Breed = require('../breed')
const Image = require('../image')
const db = require('../../config/mongoose')
const breedsList = require('../../public/breeds.json')
const imagesList = require('../../public/images.json')

db.once('open', () => {
  breedsList.forEach(breed => {
    Breed.create(breed)
  })

  imagesList.forEach(image => {
    Image.create(image)
  })

  console.log('allSeeder done!')
})