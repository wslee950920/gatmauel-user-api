const express = require("express");

const distance=require('./distance');

const router = express.Router();

router.get('/distance', distance);

module.exports = router;