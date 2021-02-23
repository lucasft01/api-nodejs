const mongoose = require('mongoose')
const Schema = mongoose.Schema

const category = new Schema({
  createad_in: { type: Date, required: true },
  imagesAdmin: {
    enabled: { type: String, required: true },
    disabled: { type: String, required: true }
  }
  ,
  imagesApp: {
    enabled: { type: String, required: true },
    disabled: { type: String, required: true }
  },
  name: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false },
})
category.methods.createMenu = function (restaurantId) {
  this.restaurantId = restaurantId
}
module.exports = mongoose.model('categorie', category)