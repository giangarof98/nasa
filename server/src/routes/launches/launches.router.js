const express = require('express')
const {
    httpgetAllLaunches,
    httpAddNewLaunch} = require('./launches.controllers')
const router = express.Router()

router.get('/', httpgetAllLaunches);
router.post('/', httpAddNewLaunch)
module.exports = router;