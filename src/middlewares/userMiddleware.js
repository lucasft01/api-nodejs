const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const Menu = require('../models/Menu')

const userMiddleware = async (req, res, next) => {
  try {
    const { token: refreshToken } = req.headers
    if (!refreshToken) return res.sendStatus(406)
    const user = await User.findOne({ refreshToken })
    if (!user) return res.sendStatus(404)
    const { _id: restaurantId } = await Restaurant.findOne({ userId: user._id }, { _id: 1 })
    const { _id: menuId } = await Menu.findOne({ restaurantId }, { _id: 1 })
    const newRefreshToken = await user.loginWithRefreshToken(refreshToken)
    if (!newRefreshToken && newRefreshToken !== null) return res.sendStatus(406)
    await user.save()
    req.user = { userId: user._id, email: user.email }
    req.restaurantId = restaurantId
    req.menuId = menuId
    req.token = newRefreshToken === null ? { value: refreshToken, isNew: false } : { value: newRefreshToken, isNew: true }
    next()
  } catch (e) {
    console.error(e)
    return res.send(e).status(500)
  }
}

module.exports = userMiddleware