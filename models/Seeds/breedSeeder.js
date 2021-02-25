const mongoose = require('mongoose')
const Breed = require('../breed')
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

axios.get(BASE_URL + '/v1/breeds')
  .then((res) => {
    let breedsList = []
    breedsList.push(...res.data)
    breedsList.forEach(breed => {
      Breed.create(breed)
    })
    console.log('breedSeeder done!')
  })
  .catch((err) => {
    console.log(err)
  })