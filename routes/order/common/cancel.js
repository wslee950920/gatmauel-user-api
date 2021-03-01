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
const logger=require('../../../logger');

module.exports=async(req, res, next)=>{
    let measure=null;
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
        measure=order[0].measure;

        await Order.update({paid:true},{
            where:{id:order[0].id},
            transaction:t
        });
        await Order.destroy({ 
            where: { id:order[0].id }, 
            transaction: t 
        });
        await Detail.destroy({
            where:{orderId:order[0].id}, 
            transaction:t
        });

        if(measure==='kakao'){
            const result=await axios({
                method:'post',
                url:"https://kapi.kakao.com/v1/payment/order",
                headers:{
                    'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                params:{
                    cid:'TC0ONETIME',
                    tid:order[0].tId
                }
            });
            
            if(result.data.status==='QUIT_PAYMENT'){
                await t.commit();
                return res.redirect(`https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}/result?orderId=${order[0].orderId}`);
            } else{
                throw new Error(result.data.status); 
            }
        } else if(measure==='card'){
            await t.commit();
            return res.status(204).end();
        }
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
                if(measure==='kakao'){
                    if(process.env.NODE_ENV==='production'){
                        logger.error(err.message);
                    }
                    return res.redirect(`https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}/error/cancel`);
                }
                else if(measure==='card'){
                    return next(err);
                }
            }
        );

        if(measure==='kakao'){
            if(process.env.NODE_ENV==='production'){
                logger.error(error.message);
            }
            return res.redirect(`https://${process.env.NODE_ENV==='production'?'www.gatmauel.com':'localhost'}/error/cancel`);
        } else if(measure==='card'){
            return next(error);
        }
    }
}