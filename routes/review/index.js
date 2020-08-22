const express = require("express");

const uploadS3 = require("./upload/uploadS3");
const { isLoggedIn, isNotLoggedIn } = require("../../lib/loginMiddleware");

const upload = require("../review/upload");

const router = express.Router();

router.post("/img", isLoggedIn, uploadS3.array("img"), upload);

module.exports = router;
