const Breed = require('../breed')
const axios = require('axios').default
const db = require('../../config/mongoose')
const BASE_URL = "https://api.thecatapi.com"

// Get breeds data from https://thecatapi.com and store in db
db.once('open', () => {
  axios.get(BASE_URL + "/v1/breeds")
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
})

