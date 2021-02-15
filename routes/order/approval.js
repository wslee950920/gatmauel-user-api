const axios=require('axios');

module.exports=(req, res, next)=>{
    const {tid, orderId}=req.session.payload;

    axios({
        method:'post',
        url:"https://kapi.kakao.com/v1/payment/approve",
        headers:{
            'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        params:{
            cid:'TC0ONETIME',
            tid,
            partner_order_id:orderId,
            partner_user_id:'gatmauel9300',
            pg_token:req.query.pg_token.toString(),
        }
    }).then(()=>{
        return res.redirect('/api/order/finish');
    }).catch((err)=>{
        next(err);
    })
}