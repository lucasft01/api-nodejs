const { config } = require("dotenv")
config()
require('../config')

const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const Menu = require('../models/Menu')
const Service = require('../models/Service')
const Category = require('../models/Category')
const MenuItemCategory = require('../models/MenuItemCategory')
const NutriRestrict = require('../models/NutriRestrict')
const Promotion = require('../models/Promotion')
const { ObjectID } = require('mongodb')
const RESTAURANT = require('./collections/restaurant.json')
const SERVICES = require('./collections/services.json')
const RESTRICTTYPES = require('./collections/restrictTypes.json')
const CATEGORIES = require('./collections/restaurantCategories.json')

const createUser = async () => {
  try {
    const { PASSWORD: password, EMAIL: email } = process.env
    const user = new User({ password, email })
    await user.createUser()
    const restaurant = new Restaurant({
      userId: user._id,
      ...RESTAURANT
    })
    const promotion = new Promotion({
      restaurantId: restaurant._id
    })
    const menuItemCategoryPlate = {
      _id: new ObjectID(),
      description: "",
      additionalsActive: false,
      name: "Entradas e Porções",
      additionals: []
    }
    const plate = {
      _id: new ObjectID(),
      createad_in: new Date(),
      active: true,
      image: process.env.MENU_IMG_PLATE_DEFAULT,
      name: "Prato",
      description: "Descrição do Prato",
      price: 15.5,
      prepTimeMin: 15,
      type: "plate",
      category: menuItemCategoryPlate
    }
    const menuItemCategoryDrink = {
      _id: new ObjectID(),
      description: "<p>Venda de bebidas alcoólicas apenas para maiores de 18 anos, se for dirigir não beba.</p><p>*Receita padrão com 2,5 doses de destilado&nbsp;</p>",
      additionalsActive: true,
      name: "Caipirinhas",
      additionals: [
        {
          active: true,
          additional: "Frutas do Dia",
          description: "",
          price: 4
        }
      ]
    }
    const drink = {
      _id: new ObjectID(),
      createad_in: new Date(),
      active: true,
      image: process.env.MENU_IMG_DRINK_DEFAULT,
      name: "Drink",
      description: "Descrição da Bebida",
      price: 17.5,
      prepTimeMin: 17,
      type: "drink",
      category: menuItemCategoryDrink
    }
    const menu = new Menu({
      restaurantId: restaurant._id,
      menu: [{ ...plate }, { ...drink }]
    })
    await MenuItemCategory.update({ restaurantId: restaurant._id }, {
      $addToSet: {
        categories: menuItemCategoryPlate
      }
    }, { upsert: true })
    await MenuItemCategory.update({ restaurantId: restaurant._id }, {
      $addToSet: {
        categories: menuItemCategoryDrink
      }
    }, { upsert: true })
    await menu.validate()
    await restaurant.validate()
    await promotion.validate()
    await user.validate()
    await user.save()
    await restaurant.save()
    await promotion.save()
    await menu.save()
    return true
  } catch (e) {
    throw new Error(e.toString())
  }
}

const createService = async () => {
  try {
    SERVICES.forEach(async service => {
      const { imagesAdmin, imagesApp, name } = service
      const createad_in = new Date()
      const ServiceDocument = await new Service({ imagesAdmin, imagesApp, name, createad_in })
      await ServiceDocument.validate()
      await ServiceDocument.save()
    })
    return true
  } catch (e) {
    throw new Error(e.toString())
  }
}

const createCategory = async () => {
  try {
    CATEGORIES.forEach(async category => {
      const { imagesAdmin, imagesApp, name } = category
      const createad_in = new Date()
      const CategoryDocument = new Category({ imagesAdmin, imagesApp, name, createad_in })
      await CategoryDocument.validate()
      await CategoryDocument.save()
    })
    return true
  } catch (e) {
    throw new Error(e.toString())
  }
}

const createRestrictAlimentation = async () => {
  try {
    RESTRICTTYPES.forEach(async nutriRestrict => {
      const { name, itemType } = nutriRestrict
      const createad_in = new Date()
      const NutriRestrictDocument = new NutriRestrict({ name, itemType, createad_in })
      await NutriRestrictDocument.validate()
      await NutriRestrictDocument.save()
    })
    return true
  } catch (e) {
    throw new Error(e.toString())
  }
}

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

const runSeed = async () => {
  try {
    await createService()
    await createCategory()
    await createRestrictAlimentation()
    await createUser()
    console.log("Finish Seed")
    process.exit(0);
  } catch (e) {
    console.error(e)
    process.exit(1);
  }
}


runSeed()


