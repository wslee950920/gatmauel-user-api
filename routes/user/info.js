const { User } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findByPk(res.locals.user.id);
    const data = {
      email: user.email,
      address: user.address,
      phone: user.phone,
    };

    return res.json(data);
  } catch (e) {
    console.error(e);

    next(e);
  }
};
