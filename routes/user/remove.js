const schedule = require("node-schedule");

const { User } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.user;
  const end = new Date();
  end.setDate(end.getDate() + 7);

  try {
    await User.destroy({ where: { id } });

    schedule.scheduleJob(end, async () => {
      await User.destroy({ where: { id }, force: true });
    });

    res.redirect("/api/auth/logout");
  } catch (e) {
    console.error(e);

    next(e);
  }
};
