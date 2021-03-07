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

        const order=await Order.findOne({
            where:{
                orderId:req.query.orderId
            }
        });

        await Order.update({paid:true},{
            where:{id:order.id},
            transaction:t
        });
        await Order.destroy({ 
            where: { id:order.id }, 
            transaction: t 
        });
        await Detail.destroy({
            where:{orderId:order.id}, 
            transaction:t
        });

        if(order.measure==='kakao'){
            const result=await axios({
                method:'post',
                url:"https://kapi.kakao.com/v1/payment/order",
                headers:{
                    'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                params:{
                    cid:'TC0ONETIME',
                    tid:order.tId
                }
            });

            if(result.data.status!=='QUIT_PAYMENT'){
                throw new Error(result.data.status); 
            }
        }

        await t.commit();
        if(order.measure==='card'&&req.useragent.isDesktop){
            return res.end();
        }
        return res.redirect(`https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}/result?orderId=${order.orderId}`);
    } catch(error){
        await t.rollback();

        transporter.sendMail(
            {
              from: "no-reply@gatmauel.com",
              to: 'wslee950920@gmail.com',
              subject: "결제 취소 프로세스 에러",
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