module.exports=(req, res, next)=>{
    req.session.destroy();
    
    const obj={
        fail:'결제를 실패하였습니다.'
    }
    const script=`<script type="text/javascript">window.opener.postMessage(${JSON.stringify(obj)}, 'http://localhost:3000');window.close();</script>`
    return res.send(script);
}