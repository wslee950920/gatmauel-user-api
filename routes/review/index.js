const express = require("express");

const uploadS3 = require("./upload/uploadS3");
const { isLoggedIn } = require("../../lib/loginMiddleware");
const getReviewById = require("./mid/getReviewById");
const checkOwnReview = require("./mid/checkOwnReview");

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
router.get("/read/:id", getReviewById, read);
router.delete("/remove/:id", isLoggedIn, getReviewById, checkOwnReview, remove);
router.patch("/update/:id", isLoggedIn, getReviewById, checkOwnReview, update);

module.exports = router;
