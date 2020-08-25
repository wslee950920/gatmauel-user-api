const { Review } = require("../../models");

module.exports = (req, res, next) => {
  res.send(req.review);
};
