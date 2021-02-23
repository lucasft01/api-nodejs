const { getExtensao, isMimetypePermitido } = require('./fileTypes')
const multer = require('multer')
const storageRestaurantImg = multer.diskStorage({
  destination: "./images/",
  filename(req, file, cb) {
    const { restaurantId } = req
    const ext = getExtensao(file.mimetype);
    cb(null, `profile-${restaurantId}.${ext}`);
  }
});

const storageMenuImg = multer.diskStorage({
  destination: "./images/",
  filename(req, file, cb) {
    const { restaurantId, params: { menuItemId } } = req
    const ext = getExtensao(file.mimetype);
    cb(null, `menu-${restaurantId}-${menuItemId}.${ext}`);
  }
});

const storagePromotionImg = multer.diskStorage({
  destination: "./images/",
  filename(req, file, cb) {
    const { restaurantId, params: { promotionId } } = req
    const ext = getExtensao(file.mimetype);
    cb(null, `promotion-${restaurantId}-${promotionId}.${ext}`);
  }
});

function fileFilter(req, file, cb) {
  if (file && !isMimetypePermitido(file.fieldname, file.mimetype)) {
    return cb("Tipo de arquivo não suportado", false);
  }
  cb(null, true);
};

const uploadRestaurantImg = multer({ storage: storageRestaurantImg, fileFilter: fileFilter })
const uploadMenuImg = multer({ storage: storageMenuImg, fileFilter: fileFilter })
const uploadPromotionImg = multer({ storage: storagePromotionImg, fileFilter: fileFilter })

module.exports = { uploadRestaurantImg, uploadMenuImg, uploadPromotionImg }