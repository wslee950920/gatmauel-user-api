exports.isLoggedIn = (req, res, next) => {
  if (res.locals.user) {
    return next();
  } else {
    return res.status(403).end();
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!res.locals.user) {
    return next();
  } else {
    return res.status(406).end();
  }
};
