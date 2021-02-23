const mongoose = require('mongoose')
const Schema = mongoose.Schema
const md5 = require("md5")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SALT_BCRYPT = parseInt(process.env.SALT_BCRYPT)

const user = new Schema({
  password: { type: String, required: true },
  email: { type: String, required: true },
  token: { type: String, required: true },
  refreshToken: { type: String, default: "" },
  activate: { type: Boolean, default: false }
})

user.methods.generateToken = function () {
  const date = new Date()
  this.token = md5(`${this._id}${date}`)
  return this.token
}

user.methods.generateRefreshToken = function () {
  this.refreshToken = jwt.sign({
    userId: this._id,
    createdIn: new Date()
  }, this.token);
  return this.refreshToken
}

user.methods.createUser = async function () {
  this.password = await this.encryptPassword(this.password)
  this.generateToken()
  this.generateRefreshToken()
  this.login(this.email, this.password)
}

user.methods.encryptPassword = async function (password) {
  return await bcrypt.hash(password, SALT_BCRYPT, null)
}

user.methods.renewToken = function () {
  this.generateToken()
  this.generateRefreshToken()
}

user.methods.validateUser = async function (email, password) {
  const validateEmail = this.email === email
  const validatePassword = await bcrypt.compare(password, this.password)
  return validateEmail && validatePassword
}

user.methods.login = async function (email, password) {
  const resultValidation = await this.validateUser(email, password)
  if (resultValidation)
    return this.generateRefreshToken()
  return false
}

user.methods.loginWithRefreshToken = function (refreshToken) {
  try {
    jwt.verify(refreshToken, this.token)
    return null
  } catch (e) {
    if (e.name === "TokenExpiredError")
      return this.generateRefreshToken()
    console.error(e)
    return false
  }
}

user.methods.logOutUser = function () {
  this.refreshToken = ""
}

user.index({ email: 1 }, { unique: true })
module.exports = mongoose.model('user', user)

