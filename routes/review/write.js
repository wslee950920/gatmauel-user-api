const joi = require("joi");

const { Review } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    nick: joi.string().max(20).required(),
    content: joi.string().required(),
    img: joi.string().max(200),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { nick, content, img } = req.body;
  try {
    const review = await Review.create({
      nick,
      content,
      img,
    });
  } catch (error) {}
};
