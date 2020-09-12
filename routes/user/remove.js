const schedule = require("node-schedule");

const { User, sequelize, Review, Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = res.locals.user;
  const end = new Date();
  end.setDate(end.getDate() + 7);

  const t = await sequelize.transaction();
  try {
    await Comment.update(
      { nick: "(알 수 없음)" },
      { where: { userId: id }, transaction: t }
    );
    await Review.update(
      { nick: "(알 수 없음)" },
      { where: { userId: id }, transaction: t }
    );
    await User.destroy({ where: { id }, transaction: t });

    await t.commit();

    schedule.scheduleJob(end, () => {
      User.destroy({ where: { id }, force: true });
    });

    res.redirect("/api/auth/logout");
  } catch (e) {
    console.error(e);

    await t.rollback();

    next(e);
  }
};
