const express = require('express');
const router = express.Router();

const {
    httpgetAllPlanets,
} = require('./planets.controller')

router.get('/planets', httpgetAllPlanets);

module.exports = router;