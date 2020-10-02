const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");
const getReviewById = require("./mid/getReviewById");
const checkOwnReview = require("./mid/checkOwnReview");

const upload = require("./upload");
const write = require("./write");
const list = require("./list");
const read = require("./read");
const remove = require("./remove");
const update = require("./update");
const user = require("./user");
const hashtag = require("./hashtag");

const router = express.Router();

router.post("/write", isLoggedIn, upload, write);
router.get("/list", list);
router.get("/read/:id", getReviewById, read);
router.delete("/remove/:id", isLoggedIn, getReviewById, checkOwnReview, remove);
router.patch("/update/:id", isLoggedIn, getReviewById, checkOwnReview, update);
router.get("/user", isLoggedIn, user);
router.get("/hashtag", hashtag);

module.exports = router;
