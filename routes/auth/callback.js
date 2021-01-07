const jwt = require("jsonwebtoken");

const { User } = require("../../models");

const AuthCallback = (req, res, next) => {
  const { token } = req.query;
  jwt.verify(token, process.env.AUTH_SECRET_KEY, async (error, decoded) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        return res.send(`
                <div>
                    <br/>
                    <h2>링크가 만료됐습니다.</h2>
                </div>
            `);
      }
    }
    
    try {
      const already=await User.findByPk(decoded.id);
      if(already.eVerified){
          return res.send(`
            <div>
                <br/>
                <h2>이미 인증이 완료된 이메일입니다.</h2>
            </div>
          `)
      }

      const num = await User.update(
        { eVerified: true },
        {
          where: {
            id: decoded.id,
          },
        }
      );
      if (num[0] === 0) {
        return res.status(400).end();
      }

      return res.send(`
                <div>
                    <br/>
                    <h2>${decoded.email}인증이 완료되었습니다.</h2>
                </div>
            `);
    } catch (e) {
      console.error(e);

      next(e);
    }
  });
};

module.exports = AuthCallback;