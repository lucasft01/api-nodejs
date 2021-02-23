const { Router } = require("express")
const { confirmedEmail, loginUser } = require("../controllers/home")

const user = Router()
user.route("/confirmedEmail/:token").get(confirmedEmail)
user.route("/login").post(loginUser)

module.exports = user
