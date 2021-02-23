const { Router } = require("express")
const profile = require('./profile')
const menu = require('./menu')
const promotions = require('./promotions')

const index = Router()
index.use(profile)
index.use(menu)
index.use(promotions)

module.exports = index