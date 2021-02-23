const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuItemCategory = new Schema({
  restaurantId: { type: String, required: true },
  categories: [{
    name: { type: String, required: true },
    description: { type: String, default: '' },
    additionalsActive: { type: Boolean, default: false },
    additionals: [
      {
        active: { type: Boolean, default: true },
        additional: { type: String, default: '' },
        description: { type: String, default: '' },
        price: { type: Number, default: 0 }
      }
    ]
  }],
  createad_in: { type: Date, required: true },
})

menuItemCategory.index({ restaurantId: 1 }, { unique: true })

module.exports = mongoose.model('menuItemCategorie', menuItemCategory)