const { Review, sequelize, Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const t = await sequelize.transaction();
  try {
    await Comment.destroy({ where: { reviewId: id }, transaction: t });
    const result=await Review.destroy({ where: { id }, transaction: t });

    await t.commit();

    res.json({deleted:id});
  } catch (e) {
    console.error(e);

    await t.rollback();

    next(e);
  }
};
