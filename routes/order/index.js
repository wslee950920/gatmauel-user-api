const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");

const distance=require('./distance');
const pay=require('./pay');
const recent=require('./recent');
const approval=require('./approval');
const cancel=require('./cancel');
const fail=require('./fail');
const finish=require('./finish');

const router = express.Router();

router.get('/distance', distance);
router.post('/pay', pay);
router.get('/recent', isLoggedIn, recent);
router.get('/approval', approval);
router.get('/cancel', cancel);
router.get('/fail', fail);
router.get('/finish', finish);

module.exports = router;