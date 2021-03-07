const joi = require("joi");
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");

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

const { User, sequelize } = require("../../models");

const kakaoV2= async (req, res, next)=>{
    const schema = joi.object().keys({
        snsId:joi.number().required(),
        email:joi.string().email().required(),
        nick:joi.string().required(),
        eVerified:joi.boolean().required(),
        phone:joi.string().max(11).required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const { email, nick, snsId, eVerified, phone } = req.body;
    const t=await sequelize.transaction();
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
              eVerified,
              phone,
              pVerified:true
            },{
                transaction:t
            });
            if(!newUser.eVerified){
                const urlToken = jwt.sign(
                    {
                      id: newUser.id,
                      email: newUser.email,
                    },
                    process.env.AUTH_SECRET_KEY,
                    {
                      expiresIn: "3d",
                    }
                );
                // send some mail
                await transporter.sendMail(
                    {
                        from: "no-reply@gatmauel.com",
                        to: newUser.email,
                        subject: "갯마을 회원가입 이메일 인증",
                        html: `<p>갯마을 회원가입 이메일(${newUser.email}) 인증 링크입니다. 아래 링크를 클릭해주세요.</p>
                            <a href="https://${process.env.NODE_ENV==='production'
                                ?'user.gatmauel.com'
                                :'localhost'
                            }/@user/auth/callback?token=${urlToken}" target="_blank">https://${
                                process.env.NODE_ENV==='production'
                                ?'user.gatmauel.com'
                                :'localhost'
                            }/@user/auth/callback?token=${urlToken}</a>
                            <p>위 링크는 3일간 유효합니다.</p>`,
                    }
                );

                const end = new Date();
                end.setDate(end.getDate() + 3);
                schedule.scheduleJob(end, () => {
                    User.destroy({ 
                        where: { 
                            id:newUser.id,
                            eVerified:false 
                        }, 
                        force: true 
                    });
                });

                await t.commit();

                return res.status(403).end();
            } else{
                const token = newUser.generateToken(false);
                const data = newUser.serialize();

                await t.commit();

                return res
                    .cookie("access_token", token, {
                        maxAge: 1000 * 60 * 60 * 24,
                        httpOnly: true,
                        secure: false,
                        signed: true,
                    })
                    .json(data);
            }
        }
    } catch (error) {          
        await t.rollback();

        return next(error);
    }
}

module.exports = kakaoV2;