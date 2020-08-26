const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");

const write = require("./write");
const remove = require("./remove");

const router = express.Router();

router.post("/write/:id", isLoggedIn, write);
router.delete("/remove/:id", isLoggedIn, remove);

module.exports = router;
