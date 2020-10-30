const joi = require("joi");

const { Notice } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    content: joi.string().required(),
    title:joi.string().max(100).required()
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  const { content, title } = req.body;
  try {
    const notice = await Notice.create({
      userId:res.locals.user.id,
      nick: res.locals.user.nick,
      content,
      title
    });

    res.json(notice);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
