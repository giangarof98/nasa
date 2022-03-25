const express = require('express');
const {
    httpgetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
} = require('./launches.controllers')
const router = express.Router()

router.get('/', httpgetAllLaunches);
router.post('/', httpAddNewLaunch);
router.delete('/:id', httpAbortLaunch)
module.exports = router;