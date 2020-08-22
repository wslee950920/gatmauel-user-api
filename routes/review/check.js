const joi = require("joi");

module.exports = (req, res, next) => {
  const schema = joi.object().keys({
    id: joi.number().required(),
  });
  const result = schema.validate(req.params);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  return next();
};
