// define tools express and router
const express = require('express')
const Router = express.Router()

// import all controller
const {adminController} = require('./../controllers')
const {tokenVerify} = require('../middleware/verifyToken')
const upload = require('../middleware/upload')

// path nya
Router.post('/login', adminController.adminLogin)
Router.post('/profile-setting', adminController.findAdmin)
Router.post('/update', adminController.update)
Router.post('/register', adminController.register)
Router.get('/allAdmin', adminController.getAllAdmin)
Router.get('/allUser', adminController.getAllUser)
Router.get('/keep-login', tokenVerify, adminController.keep_login)
Router.post('/delete', adminController.delete)
Router.post('/update-photo', upload, tokenVerify, adminController.updateAdminPhoto)

//
module.exports = Router