const joi = require("joi");

const { Review, Hashtag, sequelize } = require("../../models");

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    content: joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const { content } = req.body;
  const imgs = req.files;
  const t = await sequelize.transaction();
  try {
    const keys = await imgs.map((img) => {
      return img.key.replace("original", "/resized", 1).replace(/(\s*)/g, "");
    });

    const review = await Review.create({
      nick: res.locals.user.nick,
      content,
      imgs: keys.join("||"),
      userId: res.locals.user.id,
    },{
      transaction:t
    });
    
    const hashtags = content.match(/#[^\s]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
            transaction:t
          })
        )
      );
      await review.addHashtags(result.map((r) => r[0]),{
        transaction:t
      });
    }

    await t.commit();

    return res.json(review);
  } catch (error) {
    await t.rollback();

    return next(error);
  }
};
