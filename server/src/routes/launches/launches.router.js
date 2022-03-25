const express = require('express')
const {httpgetAllLaunches} = require('./launches.controllers')
const router = express.Router()

router.get('/launches', httpgetAllLaunches);

module.exports = router;