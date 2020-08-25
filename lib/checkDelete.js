const { User } = require("../models");
const { Op } = require("sequelize");

module.exports = async () => {
  const month = new Date();
  month.setDate(month.getDate() - 7);

  try {
    await User.destroy({
      where: {
        deletedAt: { [Op.lte]: month },
      },
      force: true,
    });
  } catch (e) {
    console.error(e);

    next(e);
  }
};
