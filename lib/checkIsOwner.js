module.exports = (req, res, next) => {
    const user = res.locals.user;
  
    if (user.nick!=='사장님') {
      return res.status(403).send("접근 권한이 없습니다.");
    }
  
    return next();
  };
  