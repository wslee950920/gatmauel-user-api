const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");
const getCommentById = require("./mid/getCommentById");
const checkOwnComm = require("./mid/checkOwnComm");

const write = require("./write");
const remove = require("./remove");
const update = require("./update");
const list = require("./list");

const router = express.Router();

router.post("/write", isLoggedIn, write);
router.delete("/remove/:id", isLoggedIn, getCommentById, checkOwnComm, remove);
router.patch("/update/:id", isLoggedIn, getCommentById, checkOwnComm, update);
router.get("/list", isLoggedIn, list);

module.exports = router;
