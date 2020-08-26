const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    await Comment.destroy({ where: { id } });

    res.status(204).end();
  } catch (e) {
    console.error(e);

    next(e);
  }
};
