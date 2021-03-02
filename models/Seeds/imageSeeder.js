const Image = require('../image')
const axios = require('axios').default
const db = require('../../config/mongoose')
const BASE_URL = "https://api.thecatapi.com"

// Get images data from https://thecatapi.com and store in db
// Only fetch 90 images in page 1 - 10
db.once('open', () => {
  axios.get(BASE_URL + "/v1/images/search?limit=90&page=10&order=Desc")
    .then((res) => {
      let gallery = []
      gallery.push(...res.data)
      gallery.forEach((image) => {
        Image.create(image)
      })
      console.log('imageSeeder done!')
    })
    .catch(err => {
      console.log(err)
    })
})
