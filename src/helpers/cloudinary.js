const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
dotenv.config()

const { CLOUD_NAME: cloud_name, API_KEY: api_key, API_SECRET: api_secret } = process.env

async function uploadImageCloudinary(pathImgLocal, imageName, aplication, userId, id) {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret
  });
  const cloud = await cloudinary.v2.uploader.upload(`./${pathImgLocal}/${imageName}`, {
    public_id: `ocardapioonline/${aplication}/${userId}/${id}/${imageName}`,
    eager: [
      { width: 48, height: 48 },
      { width: 96, height: 96 },
      { width: 144, height: 144 },
      { width: 192, height: 192 },
      { width: 512, height: 512 }
    ]
  })

  const { version, public_id, secure_url } = cloud
  return { version, public_id, secure_url }
}

module.exports = uploadImageCloudinary
