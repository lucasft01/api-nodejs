const { Router } = require("express")
const {
  getRestaurant, getServices, getCategories, updateRestaurant, updateRestaurantImg
} = require("../../controllers/restaurant")
const { uploadRestaurantImg } = require("../../helpers/multer")

const profile = Router()
profile.route("/").get(getRestaurant)
profile.route("/getServices").get(getServices)
profile.route("/getCategories").get(getCategories)
profile.route("/updateRestaurant/:restaurantId").put(updateRestaurant)
profile.route("/updateRestaurantImg/:restaurantId").put(uploadRestaurantImg.single("logo"), updateRestaurantImg)

module.exports = profile
