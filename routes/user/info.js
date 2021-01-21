const { User } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findByPk(res.locals.user.id);
    const data = {
      email: user.email,
      address: user.address,
      detail:user.detail,
      phone: user.phone,
    };

    return res.json(data);
  } catch (e) {
    next(e);
  }
};
