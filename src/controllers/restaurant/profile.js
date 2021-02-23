const Restaurant = require('../../models/Restaurant')
const Menu = require('../../models/Menu')
const Service = require('../../models/Service')
const Category = require('../../models/Category')
const { getExtensao } = require('../../helpers/fileTypes')
const { uplodaImgsRestaurant } = require('../../helpers/image')
const { put, post } = require('axios')
const { URL_DYNAMIC_PWA, DOMAIN_OCARDAPIO_ONLINE, USERNAME_API_DYNAMIC_PWA, PASSWORD_API_DYNAMIC_PWA } = require('../../variables')

const getServices = async (req, res) => {
  try {
    const { token } = req
    const services = await Service.find()
    if (!services) return res.status(404).send({ token })
    return res.status(200).send({
      token: req.token,
      services
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const getCategories = async (req, res) => {
  try {
    const { token } = req
    const categories = await Category.find()
    if (!categories) return res.status(404).send({ token })
    return res.status(200).send({
      token: req.token,
      categories
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const getRestaurant = async (req, res) => {
  try {
    const { token, user } = req
    const { userId } = user
    const restaurant = await Restaurant.findOne({ userId })
    if (!restaurant) return res.status(404).send({ token })
    return res.status(200).send({
      token: req.token,
      restaurant
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const updateRestaurantImg = async (req, res) => {
  try {
    const { token, params, file, user } = req
    const { restaurantId } = params
    const { userId } = user
    const image = []
    if (file) {
      const ext = getExtensao(file.mimetype);
      const aplication = "admin"
      const categoryImg = "profile"
      const { secure_url } = await uplodaImgsRestaurant(userId, restaurantId, restaurantId, ext, aplication, categoryImg, null)
      image.push(secure_url)
    }
    else {
      const urlImg = logo ? logo : process.env.PROFILE_IMG_DEFAULT
      image.push(urlImg)
    }
    const restaurantCollection = await Restaurant.updateOne({ _id: restaurantId },
      {
        logo: image[0]
      }
    )
    if (!restaurantCollection.n) return res.status(404).send({ token })
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const updateRestaurant = async (req, res) => {
  try {
    const { token, params, user, body } = req
    const { restaurantId } = params
    const {
      slogan, fantasyName, CNPJ,
      address, style, services,
      businessHours, categories, url: app
    } = body

    const {
      complement, district,
      ZIP, street, number,
      city, state,
    } = address
    const restaurantCollection = await Restaurant.findOneAndUpdate({ _id: restaurantId },
      {
        categories,
        slogan, fantasyName, CNPJ,
        style, services, businessHours,
        address: {
          complement, district,
          ZIP, street, number,
          city, state
        }
      },
      { tokenAPIDynamicPWA: 1 }
    )


    try {
      const { colors } = style
      const { primaryColor } = colors
      const url = DOMAIN_OCARDAPIO_ONLINE
      const userName = USERNAME_API_DYNAMIC_PWA
      const password = PASSWORD_API_DYNAMIC_PWA
      const { tokenAPIDynamicPWA } = restaurantCollection
      const getTokenDynamicPWA = async () => {
        if (!tokenAPIDynamicPWA) {
          const responseAPI = await post(`${URL_DYNAMIC_PWA}/home/login`, { userName, password })
          return responseAPI.data.token.value
        }
        return tokenAPIDynamicPWA
      }

      const tokenDynamicPWA = await getTokenDynamicPWA()

      const { data } = await put(`${URL_DYNAMIC_PWA}/account/manifest`, { url, app, updates: { background_color: primaryColor, theme_color: primaryColor } }, { headers: { 'refresh-token': tokenDynamicPWA } })
      const { token: { value, isNew } } = data

      if (isNew)
        Restaurant.updateOne({ _id: restaurantId }, { tokenAPIDynamicPWA: value })
    } catch (e) {
      console.error(e)
    }

    if (!restaurantCollection.n) return res.status(404).send({ token })
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const removeRestaurant = async (req, res) => {
  try {
    const { token, params } = req
    const { restaurantId } = params
    await Restaurant.remove({ _id: restaurantId })
    await Menu.remove({ restaurantId })
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

module.exports = {
  getServices, getCategories, getRestaurant,
  updateRestaurantImg, updateRestaurant, removeRestaurant
}
