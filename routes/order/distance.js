const axios=require('axios');
const joi=require('joi');

module.exports=async (req, res, next)=>{
    const schema = joi.object().keys({
        goal:joi.string().required(),
    });
    const verify = schema.validate(req.query);
    if (verify.error) {
        return res.status(400).end(); 
    }

    try{
        const kakao=await axios.get("https://dapi.kakao.com/v2/local/search/address.json",{
            headers: {
                'Authorization' : `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
            },
            params:{
                query:req.query.goal
            }
        });
        if(kakao){
            const {x, y}=kakao.data.documents[0];
            const naver=await axios.get('https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving',
                {
                    headers:{
                        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_CLIENT_ID,
                        'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_SECRET_KEY
                    },
                    params:{
                        start: process.env.NAVER_MAP_START,
                        goal: `${x},${y}`
                    },
                });
            if(naver){
                if(naver.data.code===0){
                    const {distance}=naver.data.route.traoptimal[0].summary
                
                    return res.json({distance});
                } else{
                    return res.status(404).end();
                }
            }
        }
    } catch(error){
        return next(error);
    }
}