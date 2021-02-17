const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");

const distance=require('./distance');
const kakao=require('./kakao');
const recent=require('./recent');
const approval=require('./approval');
const cancel=require('./cancel');
const fail=require('./fail');
const finish=require('./finish');
const pay=require('./pay');

const router = express.Router();

router.post('/pay/:measure', pay, (req, res, next)=>{
    if(req.params.measure==='kakao'){
        return kakao(req, res, next);
    } else if(req.params.measure==='later'){
        return finish(req, res, next);
    }
})
router.get('/distance', distance);
router.get('/recent', isLoggedIn, recent);
router.get('/approval', approval, finish);
router.get('/cancel', cancel);
router.get('/fail', fail);

module.exports = router;