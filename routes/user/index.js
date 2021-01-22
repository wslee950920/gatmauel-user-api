const express = require("express");
const { isLoggedIn } = require("../../lib/loginMiddleware");

const info = require("./info");
const update = require("./update");
const password = require("./password");
const remove = require("./remove");
const phone=require('./phone');
const timer=require('./timer');
const callback=require('./callback');

const router = express.Router();

router.get("/info", isLoggedIn, info);
router.patch("/update", isLoggedIn, update);
router.patch("/password", isLoggedIn, password);
router.put("/remove", isLoggedIn, remove);
router.post('/phone', isLoggedIn, phone);
router.get('/timer', isLoggedIn, timer);
router.post('/callback', isLoggedIn, callback);

module.exports = router;
