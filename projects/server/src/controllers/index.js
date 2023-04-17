//define router
const adminController = require('./adminController'), transactionController= require('./transactionController')
const productController = require('./productController'), warehouseController = require('./warehouseController')

const userController = require('./userController'), logController = require('./logController')
const addressController = require('./addressController'), dashboardController= require('./dashboardController')
const rajaongkirController = require('./rajaongkirController')
const cartController = require('./cartController')
const locationProductController = require('./locationProductController')

//export it

module.exports={
    adminController,
    productController,
    userController,
    transactionController,
    addressController,
    rajaongkirController,
    warehouseController,
    cartController,
    locationProductController,
    logController,
    dashboardController
}