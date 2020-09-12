const joi = require("joi");

const { Review } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    content: joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { content } = req.body;
  const imgs = req.files;
  try {
    const keys = await imgs.map((img) => {
      return img.key.replace("original", "resized", 1).replace(/(\s*)/g, "");
    });

    const review = await Review.create({
      nick: res.locals.user.nick,
      content,
      imgs: keys.join("|"),
      userId: res.locals.user.id,
    });

    res.json(review);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
