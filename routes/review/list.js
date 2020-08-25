const { Review } = require("../../models");

module.exports = async (req, res, next) => {
  const page = parseInt(req.query.page || "1", 10);
  if (page < 1) {
    return res.status(400);
  }

  try {
    const reviews = await Review.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      offset: (page - 1) * 10,
    });

    res.set("Last-Page", reviews.count).send(reviews.rows);
  } catch (error) {
    console.error(error);

    next(error);
  }
};
