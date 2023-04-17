const express = require('express')
const Router = express.Router()

// Import All Controller
const { addressController } = require('../controllers') // Akan otomatis mengambil file index.js nya
const { tokenVerify } = require('../middleware/verifyToken')

Router.get('/', tokenVerify, addressController.getAllAddress)
Router.post('/add-address', tokenVerify, addressController.postAddress)


module.exports = Router