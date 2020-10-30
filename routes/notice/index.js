const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");
const getNoticeById = require("./mid/getNoticeById");
const checkIsOwner = require("../../lib/checkIsOwner");

const write = require("./write");
const list = require("./list");
const remove = require("./remove");
const update = require("./update");
const read = require('./read');

const router = express.Router();

router.post("/write", isLoggedIn, checkIsOwner, write);
router.get("/list", list);
router.delete("/remove/:id", isLoggedIn, checkIsOwner, getNoticeById, remove);
router.patch("/update/:id", isLoggedIn, checkIsOwner, getNoticeById, update);
router.get('/read/:id', getNoticeById, read);

module.exports = router;
