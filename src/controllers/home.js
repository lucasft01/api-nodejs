const User = require('../models/User')

const confirmedEmail = async (req, res) => {
  try {
    const { token } = req.params
    const user = await User.updateOne({ refreshToken: token }, { activate: true })
    if (!user.n) return res.send("Código não encontrado!").status(404)
    if(!user.nModified) return res.send("Email já ativado!").status(404)
    res.send("Email confirmado com sucesso").status(200)
  } catch (e) {
    console.error(e)
    res.send(e).status(500)
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user) {
      const newRefreshToken = await user.login(email, password)
      if (newRefreshToken) {
        await user.save()
        return res.send({ token: { value: newRefreshToken, isNew: true } }).status(200)
      }
      return res.sendStatus(406)
    }
    return res.sendStatus(404)
  } catch (e) {
    console.error(e)
    res.send(e).status(500)
  }
}

module.exports = { confirmedEmail, loginUser }