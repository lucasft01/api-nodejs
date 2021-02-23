const User = require('../models/User')

const userMiddlewareSocketIO = async (token) => {
  try {
    const refreshToken = token
    if (!refreshToken) return res.sendStatus(406)
    const user = await User.findOne({ refreshToken })
    if (!user) return { status: 404 }
    const newRefreshToken = await user.loginWithRefreshToken(refreshToken)
    if (!newRefreshToken && newRefreshToken !== null) return { status: 406 }
    await user.save()
    return newRefreshToken === null ? { value: refreshToken, isNew: false } : { value: newRefreshToken, isNew: true }
  } catch (e) {
    console.error(e)
    return { status: 500 }
  }
}

module.exports = userMiddlewareSocketIO