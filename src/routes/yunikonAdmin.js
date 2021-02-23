const { Router } = require("express")
const { createUser, createService, createCategory, createRestrictAlimentation } = require("../controllers/yunikonAdmin")

const user = Router()
user.route("/register").post(createUser)
user.route("/createService").post(createService)
user.route("/createCategory").post(createCategory)
user.route("/createRestrictAlimentation").post(createRestrictAlimentation)

module.exports = user
