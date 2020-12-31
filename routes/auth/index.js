const express = require("express");

const Register = require("./register");
const { CheckNick, Check } = require("./check");
const Login = require("./login");
const Logout = require("./logout");
const { kakao, kakaoCallback } = require("./kakao");

const { isLoggedIn, isNotLoggedIn } = require("../../lib/loginMiddleware");

const router = express.Router();

router.post("/register", isNotLoggedIn, Register);
router.post("/check/nick", CheckNick);
router.get("/check", isLoggedIn, Check);
router.post("/login", isNotLoggedIn, Login);
router.get("/logout", isLoggedIn, Logout);
router.get("/kakao", kakao);
router.get("/kakao/callback", kakaoCallback);
router.get('/kakao/failure', (req, res, next)=>{
    res.status(503).end();
});

module.exports = router;
