const Promotion = require('../../models/Promotion')
const { getExtensao } = require('../../helpers/fileTypes')
const { uplodaImgsRestaurant } = require('../../helpers/image')
const { ObjectID } = require('mongodb')

const getPromotion = async (req, res) => {
  try {
    const { restaurantId, token, params } = req
    const { promotionId } = params
    const promotion = await Promotion.findOne(
      { restaurantId },
      {
        "promotions": {
          $elemMatch: {
            _id: promotionId
          }
        }
      }
    )
    if (!promotion) return res.status(404).send({ token })
    return res.status(200).send({
      token: req.token,
      promotion
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const getAllPromotions = async (req, res) => {
  try {
    const { restaurantId, token } = req
    const collectionPromotions = await Promotion.findOne({ restaurantId })
    if (!collectionPromotions) return res.status(404).send({ token })
    return res.status(200).send({
      token,
      idPromotions: collectionPromotions._id,
      promotions: collectionPromotions.promotions
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const createPromotion = async (req, res) => {
  try {
    const { restaurantId, token, body } = req
    const { title, validity, price, description, rules, active } = body
    const validation = validationPromotion({ title, description, active })
    if (!validation) return res.sendStatus(406)
    const promotionId = new ObjectID()
    const createad_in = new Date()
    const promotion = {
      _id: promotionId,
      createad_in,
      price, rules, active,
      title, description, validity,
      update_in: createad_in
    }
    const collectionPromotion = await Promotion.updateOne({ restaurantId }, {
      $addToSet: {
        promotions: promotion
      }
    }, { runValidators: true, upsert: true })
    if (!collectionPromotion.n) return res.status(404).send({ token })
    return res.status(200).send({ token, newPromotionId: promotionId })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const updatePromotion = async (req, res) => {
  try {
    const { restaurantId, token, params, body } = req
    const { promotionId } = params
    const { title, validity, price, description, rules, active } = body
    const update_in = new Date()
    const collectionPromotion = await Promotion.updateOne({ restaurantId, "promotions._id": promotionId }, {
      $set: {
        "promotions.$.title": title,
        "promotions.$.validity": validity,
        "promotions.$.price": price,
        "promotions.$.description": description,
        "promotions.$.rules": rules,
        "promotions.$.active": active,
        "promotions.$.update_in": update_in
      }
    })

    if (!collectionPromotion.n) return res.status(404).send({ token })
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const updatePromotionImage = async (req, res) => {
  try {
    const { restaurantId, token, params, file, user } = req
    const { userId } = user
    const { promotionId } = params
    const image = []
    if (file) {
      const ext = getExtensao(file.mimetype);
      const aplication = "pwa"
      const categoryImg = "promotion"
      const { secure_url } = await uplodaImgsRestaurant(userId, restaurantId, promotionId, ext, aplication, categoryImg, null)
      image.push(secure_url)
    }
    else {
      const urlImg = ''
      image.push(urlImg)
    }
    const collectionPromotion = await Promotion.updateOne({ restaurantId, "promotions._id": promotionId }, {
      $set: {
        "promotions.$.image": image[0]
      }
    })
    if (!collectionPromotion.n) return res.status(404).send({ token })
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const changeStatusPromotion = async (req, res) => {
  try {
    const { restaurantId, token, params, body } = req
    const { active } = body
    const { promotionId } = params
    const collectionPromotion = await Promotion.updateOne({ restaurantId, "promotions._id": promotionId }, {
      $set: {
        "promotions.$.active": active,
      }
    })

    if (!collectionPromotion.n) return res.status(404).send({ token })
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const validationPromotion = (params) => {
  const { active, title, description } = params
  return (
    (active !== '' && active !== null && active !== undefined) &&
    (title !== '' && title !== null && title !== undefined) &&
    (description !== '' || description !== null || description !== undefined)
  )
}

module.exports = {
  createPromotion, getAllPromotions, getPromotion,
  updatePromotion, changeStatusPromotion, updatePromotionImage
}
