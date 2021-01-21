const { User } = require("../models");
const { Op } = require("sequelize");

module.exports = async () => {
  const end = new Date();
  end.setDate(end.getDate() - 30);

  try {
    await User.destroy({
      where: {
        deletedAt: { [Op.lte]: end },
      },
      force: true,
    });
  } catch (e) {
    next(e);
  }
};
