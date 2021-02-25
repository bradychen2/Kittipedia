const mongoose = require('mongoose')
const Image = require('../image')
const axios = require('axios').default
const BASE_URL = "https://api.thecatapi.com"

mongoose.connect('mongodb://localhost/kittipedia', {
  useNewUrlParser: true, useUnifiedTopology: true
})
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

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