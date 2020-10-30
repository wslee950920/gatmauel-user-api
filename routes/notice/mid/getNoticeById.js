const joi = require("joi");
const { Notice } = require("../../../models");

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
    const notice = await Notice.findOne({
      where: { id },
    });
    if (!notice) {
      return res.status(404).send("찾으시는 공지사항이 없습니다!");
    }
    res.locals.notice=notice;

    return next();
  } catch (e) {
    console.error(e);

    next(e);
  }
};
