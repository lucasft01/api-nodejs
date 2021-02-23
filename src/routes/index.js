const { Router } = require("express")
const home = require("./home")
const yunikonAdmin = require("./yunikonAdmin")
const account = require("./account")
const restaurant = require("./restaurant")
const userMiddleware = require("../middlewares/userMiddleware")

const index = Router()
index.use("/yunikon/admin", yunikonAdmin)
index.use("/home", home)
index.use("/account", userMiddleware, account)
index.use("/restaurant", userMiddleware, restaurant)

module.exports = index
