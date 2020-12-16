module.exports = (req, res, next) => {
    const user = res.locals.user;
  
    if (user.nick!=='사장님') {
      return res.status(403).end();
    }
  
    return next();
  };
  