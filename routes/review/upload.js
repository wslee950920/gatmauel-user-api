const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const upload = (req, res, next) => {
  multer({
    storage: multerS3({
      s3: new aws.S3(),
      bucket: "gatmauel",
      key(req, file, cb) {
        cb(
          null,
          `original/${res.locals.user.id}/${+new Date()}_${path.basename(
            file.originalname.replace(/(\s*)/g, "")
          )}`
        );
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }).array("imgs")(req, res, next);
};

module.exports = upload;
