const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");

const distance=require('./distance');
const alim=require('./alim');
const recent=require('./recent');
const approval=require('./approval');
const cancel=require('./cancel');
const fail=require('./fail');
const kakao=require('./kakao');
const check=require('./check');
const ready=require('./ready');
const later=require('./later');
const finish=require('./finish');
const card=require('./card');
const result=require('./result');
const reason=require('./reason');

const router = express.Router();

router.post('/pay/kakao', check, ready);
router.get('/approval', approval, alim, kakao);

router.post('/pay/later', check, later, alim, finish);
router.post('/pay/card', check, card, alim, finish);

router.get('/result/:orderId', result);

router.get('/distance', distance);
router.get('/recent', isLoggedIn, recent);
router.get('/cancel', cancel);
router.get('/reason/:orderId', reason);
router.get('/fail', fail);

module.exports = router;