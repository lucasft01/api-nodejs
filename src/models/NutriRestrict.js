const mongoose = require('mongoose')
const Schema = mongoose.Schema

const nutriRestrict = new Schema({
  createad_in: { type: Date, required: true },
  image: { type: String, default: "" },
  name: { type: String, required: true, unique: true },
  itemType: { type: String, enum: ["plate", "drink"], required: true }
})

nutriRestrict.methods.createMenu = function (restaurantId) {
  this.restaurantId = restaurantId
}

nutriRestrict.index({ name: 1, itemType: 1 }, { unique: true })
module.exports = mongoose.model('nutriRestrict', nutriRestrict)