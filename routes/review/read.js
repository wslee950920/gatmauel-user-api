const { Review } = require("../../models");

module.exports = (req, res, next) => {
  res.json(req.review);
};
