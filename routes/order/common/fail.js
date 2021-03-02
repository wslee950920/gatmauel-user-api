const axios=require('axios');
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
const joi=require('joi');

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

const { Order, Detail, sequelize } = require("../../../models");

module.exports=async(req, res, next)=>{
    const t = await sequelize.transaction();
    try{
        const schema = joi.object().keys({
            orderId:joi.string().length(10).required(),
        });
        const verify = schema.validate(req.query);
        if (verify.error) {
            throw new Error(verify.error); 
        }

        const order=await Order.findAll({
            where:{
                orderId:req.query.orderId
            }
        });

        await Order.destroy({ 
            where: { id:order[0].id }, 
            transaction: t 
        });
        await Detail.destroy({
            where:{orderId:order[0].id}, 
            transaction:t
        });

        if(order[0].measure==='kakao'){
            await axios({
                method:'post',
                url:"https://kapi.kakao.com/v1/payment/cancel",
                headers:{
                    'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                params:{
                    cid:'TC0ONETIME',
                    tid:order[0].tId,
                    cancel_amount:order[0].total,
                    cancel_tax_free_amount:0
                }
            });
        } else if(order[0].measure==='card'){
            const getToken=await axios.post('https://api.iamport.kr/users/getToken', {
                imp_key:process.env.IAMPORT_REST_API_KEY,
                imp_secret:process.env.IMAPORT_REST_API_SECRET
            }, {
                headers:{
                    "Content-Type":"application/json"
                }
            });
            const { access_token } = getToken.data.response;

            await axios.post('https://api.iamport.kr/payments/cancel',{
                imp_uid:order[0].tId,
                merchant_uid:order[0].orderId,
                checksum:order[0].total,
                reason:'결제 프로세스 실패',
            }, {
                headers: {
                    "Content-Type": "application/json", // "Content-Type": "application/json"
                    "Authorization": `Bearer ${access_token}` // 발행된 액세스 토큰
                }
            });
        } else if(order[0].measure==='later'){
            await t.commit();
            return next(order[0].measure);
        }

        await t.commit();
        if(order[0].measure==='card'&&req.useragent.isDesktop){
            return res.end();
        }
        return res.redirect(`https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}/result?orderId=${order[0].orderId}`);
    } catch(error){
        await t.rollback();

        transporter.sendMail(
            {
              from: "no-reply@gatmauel.com",
              to: 'wslee950920@gmail.com',
              subject: "결제 실패 프로세스 에러",
              html: `<p>${error}</p>
                    </br>
                    <p>${error.message}</p>`,
            },
            (err) => {                    
                return next(err);
            }
        );

        return next(error);
    }
}