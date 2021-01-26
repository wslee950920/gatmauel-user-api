const joi=require('joi');

module.exports=(req, res, next)=>{
    const schema = joi.object().keys({
        code: joi.string().required(),
        phone:joi.string().max(11).required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).end();
    }

    const {code, phone}=req.body;
        
    if(!req.session.code){            
        return res.status(419).end();
    }
        
    if(code===req.session.code){
        if(phone!==req.session.phone){
            return res.status(403).end();
        }

        delete req.session.code;
        delete req.session.phone;

        req.session.cookie.maxAge=1000*60*30;
        req.session.phone=phone;

        return res.end();
    } else{
        return res.status(404).end();
    }
}