const crypto = require('crypto');
const axios=require('axios');
const joi = require("joi");

const {User} = require('../../models');

const makeSignature=()=>{
    const space = " ";				// one space
	const newLine = "\n";				// new line
	const method = "POST";				// method
	const url = `/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`;	// url (include query string)
	const timestamp = Date.now().toString();			// current timestamp (epoch)
	const accessKey = process.env.NAVER_ACCESS_KEY;			// access key id (from portal or Sub Account)
    const secretKey = process.env.NAVER_SECRET_KEY;			// secret key (from portal or Sub Account)
    
    const hmac=crypto.createHmac('sha256', secretKey);
    hmac.update(method);
	hmac.update(space);
	hmac.update(url);
	hmac.update(newLine);
	hmac.update(timestamp);
	hmac.update(newLine);
	hmac.update(accessKey);

    return hmac.digest('base64');
}
const makeMms=(phone)=>{
    return {
        "type":"SMS",
        "contentType":"COMM",
        "countryCode":"82",
        "from":"01020770883",
        "content":"전화번호 인증",
        "messages":[
            {
                "to":phone,
                "content":`갯마을 전화번호 인증코드 ${Math.random().toString().substring(2, 8)}`
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
    try{
        await axios.post(`https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`, 
            makeMms(phone),
            {
                headers:{
                    'Content-Type': 'application/json; charset=utf-8',
                    'x-ncp-apigw-timestamp': Date.now().toString(),
                    'x-ncp-iam-access-key': process.env.NAVER_ACCESS_KEY,
                    'x-ncp-apigw-signature-v2': makeSignature().toString()
                },
            }
        ).then(async ()=>{
            const num=await User.update({phone}, {
                where: { id: res.locals.user.id }
            });
            if (num[0] === 0) {
                return res.status(400).end();
            }

            const exUser = await User.findByPk(res.locals.user.id);
            return res.json({updatedAt:exUser.updatedAt});
        })
        .catch((e)=>{
            next(e);
        });
    } catch(e){
        next(e);
    }
}