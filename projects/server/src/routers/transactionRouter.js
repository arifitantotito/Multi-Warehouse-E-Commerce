const express = require('express')
const Router = express.Router()

// Import All Controller
const { transactionController } = require('../controllers') // Akan otomatis mengambil file index.js nya
const { tokenVerify } = require('../middleware/verifyToken')
const upload = require('../middleware/upload')

Router.post('/allTransaction', transactionController.allTransaction)
Router.post('/getTransactionWH', transactionController.transactionWH)
Router.post('/filter', transactionController.filter)
Router.post('/FWarehouse', transactionController.filterWH)
Router.get('/allSales', transactionController.getSales)
Router.post('/createOrder',tokenVerify, transactionController.CreateOrder)
Router.patch('/update', transactionController.updateOrder)
Router.patch('/ship', transactionController.shipOrder)
Router.get('/getDataTransaction', tokenVerify, transactionController.getDataTransaction)
Router.get('/allTransactionUser', tokenVerify, transactionController.allTransactionUser)
Router.get('/detailTransaction', transactionController.detailTransactionUser)
Router.post('/payment-proof', upload, transactionController.uploadPayment)
Router.post('/cancel-transaction',transactionController.cancelTransactions)
Router.post('/confirm-order', transactionController.confirmOrder)
Router.get('/page-transaction', tokenVerify, transactionController.getAllTransactionUser)
Router.post('/tester', transactionController.test)


module.exports = Router