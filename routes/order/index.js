const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");

const distance=require('./distance');
const recent=require('./recent');
const result=require('./result');
const later=require('./later/later');

const alim=require('./common/alim');
const cancel=require('./common/cancel');
const fail=require('./common/fail');
const check=require('./common/check');
const finish=require('./common/finish');

const approval=require('./kakao/approval');
const kakao=require('./kakao/kakao');
const ready=require('./kakao/ready');

const card=require('./card/card');
const confirm=require('./card/confirm');
const mobile=require('./card/mobile');

const router = express.Router();

router.post('/pay/kakao', check, ready);
router.get('/approval', approval, alim, kakao);

router.post('/pay/card', check, card);
router.post('/confirm', confirm, alim, finish);
router.get('/mobile', mobile);

router.post('/pay/later', check, later, alim, finish);

router.get('/result/:orderId', result);

router.post('/distance', distance);
router.get('/recent', isLoggedIn, recent);

router.get('/cancel', cancel);
router.post('/cancel', cancel);
router.get('/fail', fail);
router.post('/fail', fail);

module.exports = router;