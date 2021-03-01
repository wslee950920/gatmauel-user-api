const joi=require('joi');

const { Review, Comment } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    page:joi.number().integer().min(1).required()
  });
  const result = schema.validate(req.query);
  if (result.error) {
    return res.status(400).end();
  }

  try {
    const reviews = await Review.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      offset: (req.query.page - 1) * 10,
      include: {
        model: Comment,
        attributes: ["id", "nick", "content", "createdAt", "adminId"],
      },
    });

    return res.set("Last-Page", Math.ceil(reviews.count/10)).json(reviews.rows);
  } catch (error) {
    return next(error);
  }
};
