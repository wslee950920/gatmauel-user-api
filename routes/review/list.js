const { Review } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.send(reviews);
  } catch (error) {
    console.error(error);

    next(error);
  }
};
