const joi = require("joi");

const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    reviewId: joi.number().required(),
    content: joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { reviewId, content } = req.body;
  try {
    const comment = await Comment.create({
      nick: req.user.nick,
      content,
      userId: req.user.id,
      reviewId,
    });

    res.json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
