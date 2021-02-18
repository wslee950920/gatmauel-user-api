const joi = require("joi");

const { Review, Hashtag, sequelize } = require("../../models");

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
  const t = await sequelize.transaction();
  try {
    const review=await Review.findByPk(id,
    {
      transaction:t
    });

    const hashtags = content.match(/#[^\s]*/g);
    if (hashtags) {
      const temp = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
            transaction:t
          })
        )
      );
      await review.addHashtags(temp.map((r) => r[0]),{
        transaction:t
      });
    }

    await Review.update(
      { content },
      { where: { id },
        transaction:t
      }
    );

    await t.commit();

    return res.json({updated:id, content});
  } catch (e) {
    await t.rollback();
    
    next(e);
  }
};
