const joi = require("joi");
const { Review, Comment } = require("../../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const schema = joi.object().keys({
    id: joi.number().required(),
  });
  const result = schema.validate(req.params);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  try {
    const review = await Review.findOne({
      where: { id },
      include: {
        model: Comment,
        attributes: ["id", "nick", "content", "createdAt"],
      },
    });
    if (!review) {
      return res.status(404).send("찾으시는 리뷰가 없습니다!");
    }
    req.review = review;

    return next();
  } catch (e) {
    console.error(e);

    next(e);
  }
};
