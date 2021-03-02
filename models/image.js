const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define Schema of images
// Reference: https://thecatapi.com
const imageSchema = new Schema({
  breeds: [{
    weight: {
      imperial: String,
      metric: String
    },
    id: String,
    name: String,
    cfa_url: String,
    vetstreet_url: String,
    vcahospitals_url: String,
    temperament: String,
    origin: String,
    country_codes: String,
    country_code: String,
    description: String,
    life_span: String,
    indoor: { type: Number, max: 1, min: 0 },
    lap: { type: Number, max: 1, min: 0 },
    alt_names: String,
    adaptability: { type: Number, max: 5, min: 1 },
    affection_level: { type: Number, max: 5, min: 1 },
    child_friendly: { type: Number, max: 5, min: 1 },
    dog_friendly: { type: Number, max: 5, min: 1 },
    energy_level: { type: Number, max: 5, min: 1 },
    grooming: { type: Number, max: 5, min: 1 },
    health_issues: { type: Number, max: 5, min: 1 },
    intelligence: { type: Number, max: 5, min: 1 },
    shedding_level: { type: Number, max: 5, min: 1 },
    social_needs: { type: Number, max: 5, min: 1 },
    stranger_friendly: { type: Number, max: 5, min: 1 },
    vocalisation: { type: Number, max: 5, min: 1 },
    experimental: { type: Number, max: 1, min: 0 },
    hairless: { type: Number, max: 1, min: 0 },
    natural: { type: Number, max: 1, min: 0 },
    rare: { type: Number, max: 1, min: 0 },
    rex: { type: Number, max: 1, min: 0 },
    suppressed_tail: { type: Number, max: 1, min: 0 },
    short_legs: { type: Number, max: 1, min: 0 },
    wikipedia_url: String,
    hypoallergenic: { type: Number, max: 1, min: 0 },
    reference_image_id: String,
  }],
  id: String,
  url: String,
  width: Number,
  height: Number
})

module.exports = mongoose.model('Image', imageSchema)