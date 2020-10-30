const { Notice } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Notice.destroy({ where: { id } });

    res.status(204).end();
  } catch (e) {
    console.error(e);

    next(e);
  }
};
