const express = require('express')
const Router = express.Router()

// Import All Controller
const {locationProductController} = require('../controllers') // Akan otomatis mengambil file index.js nya
// const upload = require('../middleware/upload')

Router.get('/', locationProductController.getLocation)
Router.get('/location-product/:location_warehouse_id', locationProductController.getLocationProduct)
Router.post('/quantity', locationProductController.getQuantity)
Router.patch('/update', locationProductController.updateStock)
Router.post('/stock', locationProductController.postStock)
Router.post('/detail', locationProductController.getDetailWarehouse)
Router.get('/category', locationProductController.getDetailCategory)
Router.post('/name', locationProductController.getDetailName)
Router.post('/spec', locationProductController.getSpec)
Router.post('/getname', locationProductController.getName)
Router.post('/getqty', locationProductController.getQty)
Router.post('/a', locationProductController.postLog)
Router.patch('/origin', locationProductController.updateLog)
Router.get('/all-mutation/:location_warehouse_id_origin', locationProductController.getMutation)
Router.post('/request/:location_warehouse_id_target', locationProductController.getRequest)
Router.post('/confirm', locationProductController.confirmProduct)
Router.post('/updateqty', locationProductController.updateProductQty)
Router.post('/confirm/:location_warehouse_id_target', locationProductController.getConfirm)
Router.post('/cancel', locationProductController.postCancel)
Router.post('/namedetail', locationProductController.getNameDetail)
Router.post('/locationwarehouse', locationProductController.postProductWarehouse)
Router.get('/all-mutation/:location_warehouse_id_origin/:order_status_id', locationProductController.getFilterMutation)

module.exports = Router