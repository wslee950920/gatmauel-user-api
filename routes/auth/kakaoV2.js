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

const kakaoV2= async (req, res, next)=>{
    const schema = joi.object().keys({
        snsId:joi.number().required(),
        email:joi.string().email().required(),
        nick:joi.string().required(),
        eVerified:joi.boolean().required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const { email, nick, snsId, eVerified } = req.body;
    try{
        const exUser = await User.findBySns(snsId, "kakao");
        if (exUser) {
            if(!exUser.eVerified){
                return res.status(403).end();
            }

            const token = exUser.generateToken(false);
            const data = exUser.serialize();
            return res
                .cookie("access_token", token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                    secure: false,
                    signed: true,
                })
                .json(data);
        } else {
            const exEmail=await User.findByEmail(email, false);
            if(exEmail){
              return res.status(409).end();
            }
            
            const newUser = await User.create({
              email,
              nick,
              snsId,
              provider: "kakao",
              eVerified
            });
            if(!newUser.eVerified){
                const urlToken = jwt.sign(
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
                        to: newUser.email,
                        subject: "갯마을 회원가입 이메일 인증",
                        html: `<p>갯마을 회원가입 이메일(${newUser.email}) 인증 링크입니다. 아래 링크를 클릭해주세요.</p>
                            <a href="http://localhost:9090/api/auth/callback?token=${urlToken}" target="_blank">http://localhost:9090/api/auth/callback?token=${urlToken}</a>
                            <p>위 링크는 3일간 유효합니다.</p>`,
                    },
                    (err) => {
                        if (err) {  
                            return next(err);
                        }
                    }
                );
            }

            const token = newUser.generateToken(false);
            const data = newUser.serialize();
            return res
                .cookie("access_token", token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                    secure: false,
                    signed: true,
                })
                .json(data);
        }
    } catch (error) {    
        return next(error);
    }
}

module.exports = kakaoV2;