const express = require('express')
const Router = express.Router()

// Import All Controller
const { cartController } = require('../controllers') // Akan otomatis mengambil file index.js nya
const { tokenVerify } = require('../middleware/verifyToken')

Router.post('/add-to-cart', tokenVerify, cartController.addCart)
Router.get('/data-cart', tokenVerify, cartController.getDataCart)
Router.post('/delete-cart', cartController.deleteCart)
Router.post('/update-cart', cartController.updateQty)

module.exports = Router