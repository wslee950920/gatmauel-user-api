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
    const num = await Review.update(
      { content: req.body.content },
      { where: { id } }
    );
    if (num[0] == 0) {
      return res.status(404).send("조건에 맞는 리뷰를 찾을 수 없습니다.");
    } else if (num[0] > 1) {
      throw new Error(`${num[0]}개의 열이 수정됨`);
    }

    res.end(n);
  } catch (e) {
    console.error(e);

    next(e);
  }
};
