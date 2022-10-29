const {createPassenger, getAllPassengers} = require('../controllers/passengerController')
const express = require('express')
const authenticate = require('../middlewares/autharize')

const router = express.Router()


router.post('/upload',createPassenger)
router.get('/dashboard', getAllPassengers)

module.exports = router