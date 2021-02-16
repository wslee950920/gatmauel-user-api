const axios=require('axios');

module.exports=(req, res, next)=>{
    const {tid}=req.session.payload;

    axios({
        method:'post',
        url:"https://kapi.kakao.com/v1/payment/order",
        headers:{
            'Authorization': `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        params:{
            cid:'TC0ONETIME',
            tid
        }
    }).then((result)=>{
        if(result.data.status==='QUIT_PAYMENT'){
            req.session.destroy();
            
            const obj={
                cancel:'결제가 취소되었습니다.'
            }
            const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'http://localhost:3000');window.close();</script>`
            return res.send(script);
        }
    }).catch((err)=>{
        next(err);
    })
}