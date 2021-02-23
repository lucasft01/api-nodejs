const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const Menu = require('../models/Menu')
const Service = require('../models/Service')
const Category = require('../models/Category')
const MenuItemCategory = require('../models/MenuItemCategory')
const NutriRestrict = require('../models/NutriRestrict')
const { sendEmail } = require('../helpers/email')
const { ObjectID } = require('mongodb')

const createUser = async (req, res) => {
  try {
    const { token } = req.headers
    const tokenYunikonAdmin = process.env.TOKEN_YUNIKON_VALIDATION
    if (tokenYunikonAdmin !== token) return res.sendStatus(401)
    const { password, email, fantasyName, url } = req.body
    const user = new User({ password, email })
    await user.createUser()
    const content = {
      message: "Confirme seu e-mail para utilizar todas as funcionalidades da plataforma",
      refreshToken: user.refreshToken,
      email
    }
    const restaurant = new Restaurant({
      userId: user._id,
      url,
      logo: process.env.PROFILE_IMG_DEFAULT,
      fantasyName
    })
    const menu = new Menu({
      restaurantId: restaurant._id
    })
    await menu.validate()
    await restaurant.validate()
    await user.validate()
    await user.save()
    await restaurant.save()
    await menu.save()
    sendEmail(content)
    return res.status(200).send({ token: { value: user.refreshToken, isNew: true } })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

const createService = async (req, res) => {
  try {
    const { token } = req.headers
    const tokenYunikonAdmin = process.env.TOKEN_YUNIKON_VALIDATION
    if (tokenYunikonAdmin !== token) return res.sendStatus(401)
    const { imagesAdmin, imagesApp, name } = req.body
    const createad_in = new Date()
    const service = await new Service({ imagesAdmin, imagesApp, name, createad_in })
    await service.validate()
    await service.save()
    return res.status(200).send({ token, service })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

const createCategory = async (req, res) => {
  try {
    const { token } = req.headers
    const tokenYunikonAdmin = process.env.TOKEN_YUNIKON_VALIDATION
    if (tokenYunikonAdmin !== token) return res.sendStatus(401)
    const { imagesAdmin, imagesApp, name } = req.body
    const createad_in = new Date()
    const category = new Category({ imagesAdmin, imagesApp, name, createad_in })
    await category.validate()
    await category.save()
    return res.status(200).send({ token, category })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

const createRestrictAlimentation = async (req, res) => {
  try {
    const { token } = req.headers
    const tokenYunikonAdmin = process.env.TOKEN_YUNIKON_VALIDATION
    if (tokenYunikonAdmin !== token) return res.sendStatus(401)
    const { name, itemType } = req.body
    const createad_in = new Date()
    const nutriRestrict = new NutriRestrict({ name, itemType, createad_in })
    await nutriRestrict.validate()
    await nutriRestrict.save()
    return res.status(200).send({ token, nutriRestrict })
  } catch (e) {
    console.error(e)
    res.status(500).send(e)
  }
}

module.exports = { createUser, createService, createCategory, createRestrictAlimentation }

async function menuItemCategory(name) {

  const createad_in = new Date()
  const _name = name.split(" ").length >= 2 ? name.split(" ") : name.split("-").length >= 2 ? name.split("-") : [name]
  const _meta = _name.map(name => name + " " + name.substring(0, 3) + " " + name.substring(1, 4))
  const meta = name.split("-").length >= 2 ? name + " " + _meta.join(" ") : _meta.join(" ")
  const _menuItemCategory = await MenuItemCategory.findOne({ name })
  if (_menuItemCategory) return _menuItemCategory
  const menuItemCategory = new MenuItemCategory({
    name, createad_in, meta
  })
  await menuItemCategory.validate()
  await menuItemCategory.save()
  return menuItemCategory

}