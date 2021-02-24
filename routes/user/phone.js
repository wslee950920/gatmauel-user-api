const axios=require('axios');
const joi = require("joi");

const {User} = require('../../models');
const {smsSignature}=require('../../lib/ncpSignature');

const makeMms=(phone, code)=>{
    return {
        "type":"SMS",
        "contentType":"COMM",
        "countryCode":"82",
        "from":"01020770883",
        "content":"전화번호 인증",
        "messages":[
            {
                "to":phone,
                "content":`갯마을 전화번호 인증코드 [${code}]`
            }
        ]
    }
}

module.exports = async (req, res, next)=>{
    const schema = joi.object().keys({
        phone: joi.string().max(11),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const {phone}=req.body;
    const code=Math.random().toString().substring(2, 8);
    try{
        if(res.locals.user){
            const exPhone=await User.findOne({where:{phone}});
            if(exPhone){
                return res.status(409).end();
            }
        }

        await axios.post(`https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NAVER_SMS_SERVICE_ID}/messages`, 
            makeMms(phone, code),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8',
                    'x-ncp-apigw-timestamp': Date.now().toString(),
                    'x-ncp-iam-access-key': process.env.NAVER_ACCESS_KEY,
                    'x-ncp-apigw-signature-v2': smsSignature().toString()
                },
            }
        );

        if(res.locals.user){
            const num=await User.update({
                pVerified:false,
                phone:null
            }, {
                where: { id: res.locals.user.id }
            });
            if (num[0] === 0) {
                return res.status(400).end();
            }
        }

        req.session.cookie.maxAge=1000*60*3;
        req.session.code=code;
        req.session.phone=phone;

        if(res.locals.user){
            const exUser = await User.findByPk(res.locals.user.id);

            return res.json({updatedAt:exUser.updatedAt});
        } else{
            return res.json({updatedAt:Date.now()});
        }
    } catch(e){
        next(e);
    }
}