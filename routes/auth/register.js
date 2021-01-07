const joi = require("joi");
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: "2010-12-01",
  }),
});

const { User } = require("../../models");

const Register = async (req, res, next) => {
  const schema = joi.object().keys({
    email: joi.string().email().max(40).required(),
    nick: joi.string().max(20).required(),
    password: joi.string().max(100).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { email, nick, password} = req.body;
  try {
    const exUser = await User.findByEmail(email, false);
    if (exUser) {
      return res.status(409).end();
    }

    const user = User.build({
      email,
      nick,
    });
    await user.setPassword(password);
    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.AUTH_SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );
    // send some mail
    transporter.sendMail(
      {
        from: "gatmauel9300@gmail.com",
        to: user.email,
        subject: "갯마을 회원가입 이메일 인증",
        html: `<p>갯마을 회원가입 이메일(${user.email}) 인증 링크입니다. 아래 링크를 클릭해주세요.</p>
              <a href="http://localhost:9090/api/auth/callback?token=${token}" target="_blank">http://localhost:9090/api/auth/callback?token=${token}</a>
              <p>위 링크는 3일간 유효합니다.</p>`,
      },
      (err) => {
        if (err) {
          console.error(err);

          return next(err);
        }
      }
    );

    return res.json(user.serialize());
  } catch (error) {
    console.error(error);

    return next(error);
  }
};

module.exports = Register;
