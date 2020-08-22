const joi = require("joi");

const { Review } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    content: joi.string().required(),
    img: joi.string().max(300),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { content, img } = req.body;
  try {
    const review = await Review.create({
      nick: req.user.nick,
      content,
      img,
      userId: req.user.id,
    });

    res.send(review);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
