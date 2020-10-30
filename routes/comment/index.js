const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");
const getCommentById = require("./mid/getCommentById");
const checkIsOwner = require("../../lib/checkIsOwner");

const write = require("./write");
const remove = require("./remove");
const update = require("./update");
const list = require("./list");

const router = express.Router();

router.post("/write/:id", isLoggedIn, checkIsOwner, write);
router.delete("/remove/:id", isLoggedIn, checkIsOwner, getCommentById, remove);
router.patch("/update/:id", isLoggedIn, checkIsOwner, getCommentById, update);
router.get("/list", isLoggedIn, checkIsOwner, list);

module.exports = router;
