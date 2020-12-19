const joi = require("joi");

const { Review } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const schema = joi.object().keys({
    content: joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const {content}=req.body;
  try {
    const rows=await Review.update(
      { content },
      { where: { id } }
    );

    res.json({rows:rows[0]});
  } catch (e) {
    console.error(e);

    next(e);
  }
};
