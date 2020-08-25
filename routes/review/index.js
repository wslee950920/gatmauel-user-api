const express = require("express");

const uploadS3 = require("./upload/uploadS3");
const { isLoggedIn } = require("../../lib/loginMiddleware");
const getPostById = require("./mid/getPostById");
const checkOwnPost = require("./mid/checkOwnPost");

const upload = require("./upload");
const write = require("./write");
const list = require("./list");
const read = require("./read");
const remove = require("./remove");
const update = require("./update");

const router = express.Router();

router.post("/img", isLoggedIn, uploadS3.array("img"), upload);
router.post("/write", isLoggedIn, write);
router.get("/list", list);
router.get("/read/:id", getPostById, read);
router.delete("/remove/:id", isLoggedIn, getPostById, checkOwnPost, remove);
router.patch("/update/:id", isLoggedIn, getPostById, checkOwnPost, update);

module.exports = router;
