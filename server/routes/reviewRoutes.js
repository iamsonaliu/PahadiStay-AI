const express = require('express')
const { listAllReviews } = require('../controllers/reviewController')
const router = express.Router()
router.get('/', listAllReviews)
module.exports = router
