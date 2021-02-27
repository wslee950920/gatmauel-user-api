const joi = require("joi");
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
const crypto=require('crypto');
const bcrypt=require('bcrypt');

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

module.exports=async(req, res, next)=>{
    const schema = joi.object().keys({
        nickname: joi.string().max(20).required(),
        phone:joi.string().max(11).required(),
        email:joi.string().email().max(40).required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const {nickname, phone, email}=req.body;
    try{
        const user=await User.findAll({
            where:{
                nick:nickname,
                phone,
                email
            }
        });
        if(user.length!==1){
            return res.status(404).end();
        }
        if(user[0].provider!=='local'){
            return res.status(403).end();
        }

        const newPassword=await crypto.randomBytes(3).toString('hex');
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        transporter.sendMail(
            {
              from: "no-reply@gatmauel.com",
              to: user[0].email,
              subject: "갯마을 비밀번호 초기화",
              html: `<p>갯마을 비밀번호가 [${newPassword}]로 초기화되었습니다.</p>
                    <p>보안을 위해 비밀번호를 변경해주세요.</p>
                    <a href="https://${process.env.NODE_ENV==='production'
                        ?'www.gatmauel.com'
                        :'localhost'
                    }/login" target="_blank">https://${
                        process.env.NODE_ENV==='production'
                        ?'www.gatmauel.com'
                        :'localhost'}/login</a>`
            },
            (err) => {
              if (err) {
                return next(err);
              }
            }
        );

        await User.update({
            hashedPassword
        }, {
            where:{
                id:user[0].id
            }
        });

        return res.status(201).end();
    } catch(error){
        return next(error);
    }
}