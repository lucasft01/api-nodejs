const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const Menu = require('../models/Menu')
const { sendEmail } = require('../helpers/email')

const getUser = async (req, res) => {
  try {
    const { token, user: _user } = req
    const { userId } = _user
    const user = await User.findOne({ _id: userId })
    if (!user) return res.status(404).send({ token })
    return res.status(200).send({
      token: req.token,
      user: {
        email: user.email
      },
      isNew: false
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e, isNew: false })
  }
}

const updateEmail = async (req, res) => {
  try {
    const { body, token } = req
    const { email, newEmail } = body
    if (email.trim() === null || email.trim() === "" || newEmail.trim() === null || newEmail.trim() === "")
      return res.status(406).send({ token, isNew: false })
    const user = await User.findOne({ email: email.toLocaleLowerCase() })
    if (!user) return res.status(404).send({ token, isNew: false })
    await user.updateOne({ email: newEmail.toLocaleLowerCase().trim(), activate: false })
    const newRefreshToken = await user.generateRefreshToken()
    await user.save()
    const content = {
      message: "Confirme seu e-mail para utilizar todas as funcionalidades da plataforma",
      refreshToken: user.refreshToken,
      email: newEmail
    }
    sendEmail(content)
    return res.status(200).send({ token: { value: newRefreshToken, isNew: true } })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const updatePassword = async (req, res) => {
  try {
    const { body, token, user: _user } = req
    const { email } = _user
    const { oldPassword, newPassword, repeatPassword } = body
    if (newPassword !== repeatPassword) return res.status(406).send({ token })
    const user = await User.findOne({ refreshToken: token.value })
    const isValid = await user.validateUser(email, oldPassword)
    if (!isValid) return res.status(406).send({ token })
    const encryptPassword = await user.encryptPassword(newPassword)
    const newRefreshToken = await user.generateRefreshToken()
    await user.updateOne({ password: encryptPassword })
    await user.save()
    return res.status(200).send({ token: { value: newRefreshToken, isNew: true } })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const removeUser = async (req, res) => {
  try {
    const { token, user: _user } = req
    const { userId } = _user
    const user = await User.findOne({ _id: userId })
    await user.remove()
    const restaurant = await Restaurant.find({ userId })
    restaurant.forEach(
      async function (doc) {
        await Menu.deleteMany({ restaurantId: doc._id })
        await doc.remove()
        doc.save()
      }
    )
    await user.save()
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

module.exports = {
  getUser, updateEmail, updatePassword, removeUser
}