exports.isLoggedIn = (req, res, next) => {
  if (req.body.state) {
    return next();
  } else {
    return res.status(403).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.body.state) {
    return next();
  } else {
    return res.status(409).send("이미 로그인 한 상태입니다.");
  }
};
