const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurant = new Schema({
  lowestPrice: { type: Number, default: 0 },
  biggestPrice: { type: Number, default: 0 },
  userId: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  logo: { type: String, default: "" },
  slogan: { type: String, default: "" },
  fantasyName: { type: String, default: "" },
  CNPJ: { type: String, default: "" },
  address: {
    ZIP: { type: String, default: "" },
    street: { type: String, default: "" },
    number: { type: Number, default: null },
    complement: { type: String, default: "" },
    district: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" }
  },
  style: {
    colors: {
      primaryColor: { type: String, default: "" },
      secondColor: { type: String, default: "" }
    },
    colorsTransformed: {
      primaryColor: {
        color01: { type: String, default: "" },
        color02: { type: String, default: "" }
      },
      secondColor: {
        color01: { type: String, default: "" },
        color02: { type: String, default: "" }
      }
    }
  },
  services: [
    {
      _id: { type: Schema.ObjectId, ref: 'services' },
      name: { type: String },
      imagesAdmin: {
        enabled: { type: String },
        disabled: { type: String }
      },
      imagesApp: {
        enabled: { type: String },
        disabled: { type: String }
      }
    }
  ],
  categories: [
    {
      _id: { type: Schema.ObjectId, ref: 'categories' },
      name: { type: String },
      imagesAdmin: {
        enabled: { type: String },
        disabled: { type: String }
      },
      imagesApp: {
        enabled: { type: String },
        disabled: { type: String }
      }
    }
  ],
  open: { type: Boolean, default: false },
  businessHours: [
    { weekDay: Number, startTime: Number, endTime: Number }
  ],
  tokenAPIDynamicPWA: {
    type: String, default: ''
  }
})

restaurant.index({ url: 1 })
restaurant.index({ userId: 1 })
module.exports = mongoose.model('restaurant', restaurant)

