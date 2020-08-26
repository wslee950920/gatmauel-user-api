const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const page = parseInt(req.query.page || "1", 10);
  if (page < 1) {
    return res.status(400);
  }

  try {
    const comments = await Comment.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      offset: (page - 1) * 10,
      where: { userId: req.user.id },
    });

    res.set("Last-Page", comments.count).json(comments.rows);
  } catch (error) {
    console.error(error);

    next(error);
  }
};
