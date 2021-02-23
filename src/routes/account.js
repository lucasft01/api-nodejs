const { Router } = require("express")
const { getUser, updateEmail, updatePassword, removeUser } = require("../controllers/account")

const account = Router()
account.route("/").get(getUser)
account.route("/updateEmail").put(updateEmail)
account.route("/updatePassword").put(updatePassword)
account.route("/removeUser").delete(removeUser)

module.exports = account
