const joi = require("joi");
const { Comment } = require("../../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const schema = joi.object().keys({
    id: joi.number().required(),
  });
  const result = schema.validate(req.params);
  if (result.error) {
    return res.status(400).end();
  }

  try {
    const comment = await Comment.findOne({
      where: { id },
    });
    if (!comment) {
      return res.status(404).end();
    }

    return next();
  } catch (e) {
    console.error(e);

    next(e);
  }
};
