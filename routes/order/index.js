const express = require("express");

const distance=require('./distance');
const pay=require('./pay');

const router = express.Router();

router.get('/distance', distance);
router.post('/pay', pay);

module.exports = router;