const mongoose = require('mongoose')
const Schema = mongoose.Schema

const promotion = new Schema({
  restaurantId: { type: String, required: true },
  promotions: [{
    createad_in: { type: Date },
    validity: { type: Date, default: null },
    active: { type: Boolean },
    image: { type: String, default: '' },
    title: { type: String },
    description: { type: String },
    rules: { type: String, default: '' },
    price: { type: Number, default: null },
    update_in: { type: Date }
  }]
})

promotion.index({ restaurantId: 1 }, { unique: true })
module.exports = mongoose.model('promotion', promotion)
