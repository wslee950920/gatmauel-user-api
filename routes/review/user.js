const { Review, Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const page = parseInt(req.query.page || "1", 10);
  if (page < 1) {
    return res.status(400).end();
  }

  try {
    const reviews = await Review.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      offset: (page - 1) * 10,
      include: {
        model: Comment,
        attributes: ["id", "nick", "content", "createdAt", "userId"],
      },
      where: { userId: res.locals.user.id },
    });

    return res.set("Last-Page", Math.ceil(reviews.count/10)).json(reviews.rows);
  } catch (error) {
    return next(error);
  }
};
