const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const upload = (req, res, next) => {
  //아래도 미들웨어 내의 미들웨어라 끝에 (req, res, next)를 붙여야
  //req, res, next를 쓸 수 있다.
  //그리고 multer생성자가 알아서 next를 호출 하는 듯, next를 따로 호출하면
  //중복 에러가 난다.
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
