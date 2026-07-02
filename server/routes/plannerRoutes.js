const express = require('express')
const { planTrip } = require('../controllers/plannerController')
const router = express.Router()
router.post('/', planTrip)
module.exports = router
