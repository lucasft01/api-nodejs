const fs = require("fs")
const { read } = require("jimp")
const uploadImageCloudinary = require('./cloudinary')

function removeImage(pathImage, imageName) {
  fs.unlinkSync(`${pathImage}/${imageName}`)
}

async function uplodaImgsRestaurant(userId, restaurantId, imgCloudId, ext, aplication, categoryImg, paramsId) {
  const pathImgLocal = "images"
  const imageName = paramsId !== null ? `${categoryImg}-${restaurantId}-${paramsId}.${ext}` : `${categoryImg}-${restaurantId}.${ext}`
  const jimpRead = await read(`./${pathImgLocal}/${imageName}`)
  await jimpRead.resize(333, 500).quality(100).writeAsync(`./${pathImgLocal}/${imageName}`)
  try {
    const { secure_url } = await uploadImageCloudinary(pathImgLocal, imageName, aplication, userId, imgCloudId)
    removeImage(pathImgLocal, imageName)
    return { secure_url }
  } catch (e) {
    console.error(e)
    removeImage(pathImgLocal, imageName)
    return e
  }
}

module.exports = { removeImage, uplodaImgsRestaurant }