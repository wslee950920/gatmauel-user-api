const jwt = require("jsonwebtoken");
const { User } = require("../models");

const jwtMiddleware = async (req, res, next) => {
  const token = req.signedCookies.access_token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const exUser=await User.findByPk(decoded.id);
    if(exUser){
      res.locals.user = { id: decoded.id, nick: decoded.nick };

      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp - now < 60 * 60) {
        const token = exUser.generateToken(false);
        
        res.cookie("access_token", token, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          secure: false,
          singed: true,
        });
      }
    } else{
      res.clearCookie('access_token');
    }

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(419).end();
    } else {
      return res.status(401).end();
    }
  }
};

module.exports = jwtMiddleware;
