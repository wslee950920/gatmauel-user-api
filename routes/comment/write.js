const joi = require("joi");

const { Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    reviewId: joi.number().required(),
    content: joi.string().required(),
  });
  const result = schema.validate({
    reviewId: req.params.id,
    content: req.body.content,
  });
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { content } = req.body;
  const { reviewId } = req.params;
  try {
    const comment = await Comment.create({
      nick: res.locals.user.nick,
      content,
      userId: res.locals.user.id,
      reviewId,
    });

    res.json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
