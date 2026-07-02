const express = require('express')
const { recommend, analyzeReviews } = require('../controllers/aiController')
const router = express.Router()
router.post('/recommend', recommend)
router.post('/analyze-reviews', analyzeReviews)
module.exports = router
