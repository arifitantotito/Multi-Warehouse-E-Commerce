// define tools express and router
const express = require('express')
const Router = express.Router()

//import all controller
const { warehouseController } = require('./../controllers')


//path nya
Router.get('/allWh', warehouseController.getDataWH)
Router.post('/addWH', warehouseController.addWH)
Router.post('/updateWH', warehouseController.updateWH)
Router.post('/deleteWH', warehouseController.deleteWH)
Router.get('/AvailableWH', warehouseController.getEmptyWH)

module.exports = Router