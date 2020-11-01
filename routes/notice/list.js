const { Notice } = require("../../models");

module.exports = async (req, res, next) => {
  const page = parseInt(req.query.page || "1", 10);
  if (page < 1) {
    return res.status(400).end();
  }

  try {
    const notices = await Notice.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      offset: (page - 1) * 10,
    });

    res.set("Last-Page", Math.ceil(notices.count/10)).json(notices.rows);
  } catch (error) {
    console.error(error);

    next(error);
  }
};
