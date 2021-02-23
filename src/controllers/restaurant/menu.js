const Menu = require('../../models/Menu')
const NutriRestrict = require('../../models/NutriRestrict')
const MenuItemCategory = require('../../models/MenuItemCategory')
const { getExtensao } = require('../../helpers/fileTypes')
const { uplodaImgsRestaurant } = require('../../helpers/image')
const { ObjectID } = require('mongodb')

async function generateMenuItemCategory(name) {

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

const getNutriRestrict = async (req, res) => {
  try {
    const { token, params } = req
    const { itemType } = params
    const nutriRestricts = await NutriRestrict.find({ itemType })
    if (!nutriRestricts) return res.status(404).send({ token })
    return res.status(200).send({
      token: req.token,
      nutriRestricts
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const getItensMenu = async (req, res) => {
  try {
    const { menuId, token, params } = req
    const { itemType } = params
    const menu = await Menu.aggregate([
      { $match: { _id: menuId } },
      {
        $project: {
          menu: {
            $filter: {
              input: '$menu',
              as: 'menu',
              cond: { $eq: ["$$menu.type", itemType] }
            }
          }
        }
      }
    ])
    if (!menu) return res.status(404).send({ token })
    return res.status(200).send({
      token: req.token,
      idMenu: menu[0]._id,
      itemsMenu: menu[0].menu
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const getMenu = async (req, res) => {
  try {
    const { restaurantId, token } = req
    const menu = await Menu.findOne({ restaurantId })
    if (!menu) return res.status(404).send({ token })
    return res.status(200).send({
      token: req.token,
      menu
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const createMenuItem = async (req, res) => {
  try {
    const { restaurantId, token, body } = req
    const { name, description, nutriRestrict, price, prepTimeMin, type, category, active, priceRange, availability, activePriceRange } = body
    const menuItemId = new ObjectID()
    const createad_in = new Date()
    const categoryItemCollection = await MenuItemCategory.findOne(
      { restaurantId },
      {
        "categories": {
          $elemMatch: {
            _id: category._id
          }
        }
      }
    )

    const minMaxPrice = () => {
      if (!activePriceRange) return { min: price, max: price }
      const arrayPriceRange = (!priceRange || priceRange.length === 0) ? [] :
        priceRange.reduce((db, item) => {
          if (item.active) db.push(item.price)
          return db
        }, [])
      if (!arrayPriceRange || arrayPriceRange.length === 0) return { min: 0, max: 0 }
      if (arrayPriceRange.length === 1) return { min: arrayPriceRange[0].price, max: arrayPriceRange[0].price }
      const min = Math.min(...arrayPriceRange)
      const max = Math.max(...arrayPriceRange)
      return { min, max }
    }

    const { min, max } = minMaxPrice()

    const menuItem = {
      _id: menuItemId,
      image: '', createad_in,
      name, description, nutriRestrict,
      price, prepTimeMin, type, category: categoryItemCollection.categories[0],
      lowestPrice: min, biggestPrice: max,
      active, priceRange, availability, activePriceRange
    }

    const menuCollection = await Menu.updateOne({ restaurantId }, {
      $addToSet: {
        menu: menuItem
      }
    })

    if (!menuCollection.n) return res.status(404).send({ token })
    return res.status(200).send({ token, newItemMenuId: menuItemId })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const getMenuItem = async (req, res) => {
  try {
    const { menuId, token, params } = req
    const { menuItemId } = params
    const menu = await Menu.findOne(
      { _id: menuId },
      {
        "menu": {
          $elemMatch: {
            _id: menuItemId
          }
        }
      }
    )
    if (!menu) return res.status(404).send({ token })
    return res.status(200).send({
      token: req.token,
      menu
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const updateMenuItemImg = async (req, res) => {
  try {
    const { restaurantId, menuId, token, params, file, user } = req
    const { userId } = user
    const { menuItemId } = params
    console.log(req)
    const getImage = async () => {
      if (file) {
        const ext = getExtensao(file.mimetype);
        const aplication = "pwa"
        const categoryImg = "menu"
        const { secure_url } = await uplodaImgsRestaurant(userId, restaurantId, menuId, ext, aplication, categoryImg, menuItemId)
        return secure_url
      }
      return ''
    }
    const image = await getImage()
    const menuCollection = await Menu.updateOne({ restaurantId, _id: menuId, "menu._id": menuItemId }, {
      $set: {
        "menu.$.image": image
      }
    })
    if (!menuCollection.n) return res.status(404).send({ token })
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const updateMenuItem = async (req, res) => {
  try {
    const { restaurantId, menuId, token, params, body } = req
    const { menuItemId } = params
    const { name, description, nutriRestrict, price, prepTimeMin, category, active, priceRange, availability, activePriceRange } = body
    const categoryItemCollection = await MenuItemCategory.findOne(
      { restaurantId },
      {
        "categories": {
          $elemMatch: {
            _id: category._id
          }
        }
      }
    )

    const minMaxPrice = () => {
      if (!activePriceRange) return { min: price, max: price }
      const arrayPriceRange = (!priceRange || priceRange.length === 0) ? [] :
        priceRange.reduce((db, item) => {
          if (item.active) db.push(item.price)
          return db
        }, [])
      if (!arrayPriceRange || arrayPriceRange.length === 0) return { min: 0, max: 0 }
      if (arrayPriceRange.length === 1) return { min: arrayPriceRange[0].price, max: arrayPriceRange[0].price }
      const min = Math.min(...arrayPriceRange)
      const max = Math.max(...arrayPriceRange)
      return { min, max }
    }

    const { min, max } = minMaxPrice()
    const menuCollection = await Menu.updateOne({ _id: menuId, "menu._id": menuItemId }, {
      $set: {
        "menu.$.name": name,
        "menu.$.description": description,
        "menu.$.nutriRestrict": nutriRestrict,
        "menu.$.price": price,
        "menu.$.prepTimeMin": prepTimeMin,
        "menu.$.active": active,
        "menu.$.category": categoryItemCollection.categories[0],
        "menu.$.lowestPrice": min,
        "menu.$.biggestPrice": max,
        "menu.$.priceRange": priceRange,
        "menu.$.availability": availability,
        "menu.$.activePriceRange": activePriceRange
      }
    })

    if (!menuCollection.n) return res.status(404).send({ token })
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const changeStatusMenuItem = async (req, res) => {
  try {
    const { menuId, token, params, body } = req
    const { active } = body
    const { menuItemId } = params
    const menuCollection = await Menu.updateOne({ _id: menuId, "menu._id": menuItemId }, {
      $set: {
        "menu.$.active": active,
      }
    })

    const minMax = await Menu.aggregate([
      { $match: { restaurantId: `${restaurantId}`, active: true } },
      { $unwind: "$menu" },
      { $group: { _id: "$restaurantId", min: { $min: "$menu.price" }, max: { $max: "$menu.price" } } }
    ])
    const { min, max } = minMax[0]

    await Menu.updateOne({ _id: menuId }, {
      lowestPrice: min,
      biggestPrice: max
    })

    await Restaurant.updateOne({ _id: restaurantId }, {
      lowestPrice: min,
      biggestPrice: max
    })

    if (!menuCollection.n) return res.status(404).send({ token })
    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const removeMenuItem = async (req, res) => {
  try {
    const { restaurantId, menuId, token, params, body } = req
    const { menuItemId } = params
    const menuCollection = await Menu.updateOne({ _id: menuId }, {
      $pull: {
        menu: { _id: menuItemId }
      }
    })

    const minMax = await Menu.aggregate([
      { $match: { restaurantId: `${restaurantId}`, active: true } },
      { $unwind: "$menu" },
      { $group: { _id: "$restaurantId", min: { $min: "$menu.price" }, max: { $max: "$menu.price" } } }
    ])
    const { min, max } = minMax[0]

    await Menu.updateOne({ _id: menuId }, {
      lowestPrice: min,
      biggestPrice: max
    })

    await Restaurant.updateOne({ _id: restaurantId }, {
      lowestPrice: min,
      biggestPrice: max
    })

    if (!menuCollection.nModified) return res.status(404).send({ token })
    res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const getMenuItemCategories = async (req, res) => {
  try {
    const { restaurantId, token } = req
    const categoriesData = await MenuItemCategory.aggregate([
      {
        $match: {
          restaurantId: restaurantId.valueOf().toString()
        }
      },
      {
        $unwind: {
          path: "$categories",
        }
      }, {
        $project: {
          'categories.additionalsActive': 1,
          'categories._id': 1,
          'categories.name': 1,
          'categories.validity': {
            $cond: {
              if: { $eq: [0, { $size: '$categories.additionals' }] },
              then: false,
              else: true
            }
          }

        }
      }, {
        $group: {
          _id: "$_id",
          categories: { $push: "$categories" }
        }
      }])
    if (categoriesData.length === 0 || !categoriesData) return res.sendStatus(404)
    return res.status(200).send({ token, categoriesData: categoriesData[0] })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const getMenuItemCategory = async (req, res) => {
  try {
    const { restaurantId, token, params } = req
    const { categoryId } = params
    const categoryDocument = await MenuItemCategory.aggregate([{
      $match: {
        restaurantId: restaurantId.valueOf().toString()
      }
    }, {
      $unwind: {
        path: '$categories',
      }
    }, {
      $match: {
        "categories._id": new ObjectID(categoryId)
      }
    }, {
      $project: {
        "category": "$categories"
      }
    }])
    const category = categoryDocument[0].category
    if (!category) return res.sendStatus(404)
    return res.status(200).send({ token, category })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const createMenuItemCategory = async (req, res) => {
  try {
    const { restaurantId, token, body } = req
    const updates = () => {
      const keys = Object.keys(body)
      const keysValids = keys.filter(key => body[key] !== null && body[key] !== undefined && body[key] !== '')
      return keysValids.reduce((db, keyValid) => ({ ...db, [keyValid]: body[keyValid] }), {})
    }
    const updatesTreated = updates()
    await MenuItemCategory.findOneAndUpdate({ restaurantId }, {
      $addToSet: {
        categories: updatesTreated
      }
    }, { upsert: true })

    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(500).send({ token: req.token, e })
  }
}

const updateMenuItemCategory = async (req, res) => {
  try {
    const { restaurantId, token, params, body } = req
    const { categoryId } = params
    const updates = () => {
      const keys = Object.keys(body)
      const keysValids = keys.filter(key => body[key] !== null && body[key] !== undefined && body[key] !== '')
      const objectTreated = keysValids.reduce((db, keyValid) => {
        return {
          ...db,
          menuItemCategory: { ...db.menuItemCategory, [`categories.$.${keyValid}`]: body[keyValid] },
          category: { ...db.category, [`menu.$[elem].category.${keyValid}`]: body[keyValid] }
        }
      }, {})
      return objectTreated
    }
    const { menuItemCategory, category } = updates()

    await MenuItemCategory.updateOne({ restaurantId: restaurantId.valueOf().toString(), "categories._id": categoryId }, {
      $set: { ...menuItemCategory }
    })

    await Menu.update(
      { restaurantId },
      { $set: { ...category } },
      { arrayFilters: [{ "elem.category._id": categoryId }], multi: true }
    )

    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
}

const removeMenuItemCategory = async (req, res) => {
  try {
    const { restaurantId, token, params } = req
    const { categoryId } = params

    const haveMenuWithThisCategory = await Menu.findOne({ restaurantId, "menu.category._id": categoryId }) ? true : false
    if (haveMenuWithThisCategory) return res.status(406).send({ token })

    await MenuItemCategory.updateOne({ restaurantId: restaurantId.valueOf().toString(), "categories._id": categoryId }, {
      $pull: { categories: { $elemMatch: { _id: categoryId } } }
    })

    return res.status(200).send({ token })
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
}

module.exports = {
  getNutriRestrict, getItensMenu, getMenu,
  createMenuItem, getMenuItem, updateMenuItemImg,
  createMenuItemCategory, changeStatusMenuItem, updateMenuItem, removeMenuItem,
  getMenuItemCategories, createMenuItemCategory, updateMenuItemCategory,
  getMenuItemCategory, removeMenuItemCategory
}
