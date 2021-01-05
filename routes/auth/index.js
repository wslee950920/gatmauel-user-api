const express = require("express");

const Register = require("./register");
const { CheckNick, Check } = require("./check");
const Login = require("./login");
const Logout = require("./logout");
const kakaoV2=require('./kakaoV2');

const { isLoggedIn, isNotLoggedIn } = require("../../lib/loginMiddleware");

const router = express.Router();

router.post("/register", isNotLoggedIn, Register);
router.post("/check/nick", CheckNick);
router.get("/check", isLoggedIn, Check);
router.post("/login", isNotLoggedIn, Login);
router.get("/logout", isLoggedIn, Logout);
router.patch("/logout", isLoggedIn, Logout);
router.put("/logout", isLoggedIn, Logout);
router.post('/kakao/v2', isNotLoggedIn, kakaoV2);

module.exports = router;
