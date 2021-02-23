const { Router } = require("express")
const {
  getAllPromotions, createPromotion, updatePromotion, changeStatusPromotion,
  updatePromotionImage, getPromotion
} = require("../../controllers/restaurant")
const { uploadPromotionImg } = require("../../helpers/multer")

const promotions = Router()
promotions.route("/getAllPromotions").get(getAllPromotions)
promotions.route("/createPromotion").post(createPromotion)
promotions.route("/getPromotion/:promotionId").get(getPromotion)
promotions.route("/updatePromotion/:promotionId").put(updatePromotion)
promotions.route("/changeStatusPromotion/:promotionId").put(changeStatusPromotion)
promotions.route("/updatePromotionImage/:promotionId").put(uploadPromotionImg.single("promotionImg"), updatePromotionImage)

module.exports = promotions
