const { Review } = require("../../models");
const joi = require("joi");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const schema = joi.object().keys({
    content: joi.string(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  try {
    const review = await Review.update(
      { content: req.body.content },
      { where: { id } }
    );
    if (review[0] == 0) {
      return res.status(404).send("리뷰를 찾을 수 없습니다.");
    }

    res.send(review);
  } catch (e) {
    console.error(e);

    next(e);
  }
};
