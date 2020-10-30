module.exports = (req, res, next) => {
    res.json(res.locals.notice);
  };
  