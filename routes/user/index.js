const express = require("express");
const { isLoggedIn } = require("../../lib/loginMiddleware");

const info = require("./info");
const update = require("./update");
const password = require("./password");

const router = express.Router();

router.get("/info", isLoggedIn, info);
router.patch("/update", isLoggedIn, update);
router.patch("/password", isLoggedIn, password);

module.exports = router;
