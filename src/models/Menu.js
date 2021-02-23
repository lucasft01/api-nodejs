const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menu = new Schema({
  restaurantId: { type: String, required: true },
  lowestPrice: { type: Number, default: 0 },
  biggestPrice: { type: Number, default: 0 },
  menu: [
    {
      createad_in: { type: Date },
      active: { type: Boolean, default: false },
      image: { type: String, default: "" },
      name: { type: String },
      relevant: { type: Boolean, default: false },
      description: { type: String },
      nutriRestrict: [{
        _id: { type: String },
        name: { type: String }
      }],
      price: { type: Number },
      prepTimeMin: { type: Number },
      type: { type: String, enum: ["plate", "drink"] },
      category: {
        _id: { type: String, default: '' },
        name: { type: String, default: '' },
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
      },
      activePriceRange: { type: Boolean, default: false },
      lowestPrice: { type: Number, default: 0 },
      biggestPrice: { type: Number, default: 0 },
      priceRange: [{
        active: { type: Boolean, default: true },
        variety: { type: String, default: '' },
        price: { type: Number, default: 0 }
      }],
      availability: { type: [Number], default: [] }
    }
  ]
})

menu.methods.createMenu = function (restaurantId) {
  this.restaurantId = restaurantId
}

menu.index({ restaurantId: 1 }, { unique: true })
module.exports = mongoose.model('menu', menu)

