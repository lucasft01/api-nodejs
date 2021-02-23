const mongoose = require('mongoose')
const Schema = mongoose.Schema

const service = new Schema({
  createad_in: { type: Date },
  imagesAdmin: {
    enabled: { type: String },
    disabled: { type: String }
  },
  imagesApp: {
    enabled: { type: String },
    disabled: { type: String }
  },
  name: { type: String, unique: true },
  enabled: { type: Boolean, default: false },
})

module.exports = mongoose.model('service', service)