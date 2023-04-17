const express = require('express')
const Router = express.Router()

// Import All Controller
const {logController} = require('../controllers') // Akan otomatis mengambil file index.js nya
// const upload = require('../middleware/upload')

Router.get('/log-history', logController.getAllLog )


module.exports = Router