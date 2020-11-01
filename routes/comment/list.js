const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const page = parseInt(req.query.page || "1", 10);
  if (page < 1) {
    return res.status(400).end();
  }

  try {
    const comments = await Comment.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      offset: (page - 1) * 10,
      where: { userId: res.locals.user.id },
    });

    res.set("Last-Page", Math.ceil(comments.count/10)).json(comments.rows);
  } catch (error) {
    console.error(error);

    next(error);
  }
};
