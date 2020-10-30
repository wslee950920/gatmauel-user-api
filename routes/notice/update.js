const { Notice } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Notice.update(
      { 
        content: req.body.content,
        title: req.body.title 
      },
      { where: { id } }
    );

    res.end();
  } catch (e) {
    console.error(e);

    next(e);
  }
};
