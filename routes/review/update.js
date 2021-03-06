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
  const hashtags = content.match(/#[^\s]*/g);
  const review=await Review.findByPk(id);
  const prev=await review.getHashtags();
  
  const t = await sequelize.transaction();
  try {  
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

      if(prev.length>0){
        const deleted=prev.filter((value)=>!hashtags.map((tag)=>
          tag.slice(1).toLowerCase()).includes(value.title));
        await review.removeHashtags(deleted, {
            transaction:t
        });
      }
    } else{
      await review.removeHashtags(prev, {
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
  } catch (error) {
    await t.rollback();
    
    return next(error);
  }
};
