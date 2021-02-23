const { Router } = require("express")
const {
  getMenu, getMenuItem, createMenuItem,
  updateMenuItem, updateMenuItemImg, removeMenuItem,
  getItensMenu, changeStatusMenuItem, createMenuItemCategory,
  getNutriRestrict, getMenuItemCategories, updateMenuItemCategory,
  getMenuItemCategory, removeMenuItemCategory
} = require("../../controllers/restaurant")
const { uploadMenuImg } = require("../../helpers/multer")

const menu = Router()
menu.route("/").get(getMenu)
menu.route("/getMenuItem/:menuItemId").get(getMenuItem)
menu.route("/createMenuItem").post(uploadMenuImg.single("menuImg"), createMenuItem)
menu.route("/updateMenuItem/:menuItemId").put(updateMenuItem)
menu.route("/updateMenuItemImg/:menuItemId").put(uploadMenuImg.single("menuImg"), updateMenuItemImg)
menu.route("/removeMenuItem/:menuItemId").delete(removeMenuItem)
menu.route("/getItensMenu/:itemType").get(getItensMenu)
menu.route("/changeStatusMenuItem/:menuItemId").put(changeStatusMenuItem)
menu.route("/createMenuItemCategory").post(createMenuItemCategory)
menu.route("/getMenuItemCategories").get(getMenuItemCategories)
menu.route("/getMenuItemCategory/:categoryId").get(getMenuItemCategory)
menu.route("/updateMenuItemCategory/:categoryId").put(updateMenuItemCategory)
menu.route("/removeMenuItemCategory/:categoryId").delete(removeMenuItemCategory)
menu.route("/getNutriRestrict/:itemType").get(getNutriRestrict)

module.exports = menu
