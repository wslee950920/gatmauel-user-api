module.exports=(req, res, next)=>{
    const err=new Error();
    
    next(err);
}