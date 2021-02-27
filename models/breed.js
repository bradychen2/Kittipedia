const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Image = require('./image')

// Define Schema of breeds
const breedSchema = new Schema({
  weight: {
    type: {
      imperial: { String, required: true },
      metric: { String, required: true }
    },
    required: true
  },
  id: String,
  name: { type: String, required: true },
  cfa_url: String,
  vetstreet_url: String,
  vcahospitals_url: String,
  temperament: String,
  origin: { type: String, required: true },
  country_codes: String,
  country_code: String,
  description: { type: String, required: true },
  life_span: { type: String, required: true },
  indoor: { type: Boolean },
  lap: { type: Boolean },
  alt_names: String,
  adaptability: { type: Number, max: 5, min: 1, required: true },
  affection_level: { type: Number, max: 5, min: 1, required: true },
  child_friendly: { type: Number, max: 5, min: 1, required: true },
  dog_friendly: { type: Number, max: 5, min: 1, required: true },
  energy_level: { type: Number, max: 5, min: 1, required: true },
  grooming: { type: Number, max: 5, min: 1, required: true },
  health_issues: { type: Number, max: 5, min: 1, required: true },
  intelligence: { type: Number, max: 5, min: 1, required: true },
  shedding_level: { type: Number, max: 5, min: 1, required: true },
  social_needs: { type: Number, max: 5, min: 1, required: true },
  stranger_friendly: { type: Number, max: 5, min: 1, required: true },
  vocalisation: { type: Number, max: 5, min: 1, required: true },
  experimental: { type: Boolean },
  hairless: { type: Boolean },
  natural: { type: Boolean },
  rare: { type: Boolean },
  rex: { type: Boolean },
  suppressed_tail: { type: Boolean },
  short_legs: { type: Boolean },
  wikipedia_url: String,
  hypoallergenic: { type: Boolean },
  reference_image_id: String,
  image: {
    id: String,
    url: String,
    width: Number,
    height: Number
  }
},
  { strictQuery: 'throw' }
)

module.exports = mongoose.model('Breed', breedSchema)
