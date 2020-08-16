const path = require("path");

module.exports = (req, res, next) => {
  res.json({ img: req.file.location });
};
