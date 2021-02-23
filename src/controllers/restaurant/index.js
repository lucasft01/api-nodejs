const menu = require("./menu")
const profile = require('./profile')
const promotions = require('./promotions')

module.exports = { ...menu, ...profile, ...promotions }