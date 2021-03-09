const joi=require('joi');

const { Hashtag } = require("../../models");

const isEnd=(page, count)=>{
  if(count===0){
    return true;
  } else{
    return page===Math.ceil(count/10)
  }
}

module.exports = async (req, res, next) => {
  const schema = joi.object().keys({
    hashtag: joi.string().required(),
    page:joi.number().integer().min(1).required(),
  });
  const result = schema.validate(req.query);
  if (result.error) {
    return res.status(400).end();
  }

  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.query.hashtag } });
    let reviews = [];
    let count=0;
    if (hashtag) {
      reviews = await hashtag.getReviews({
        order: [["createdAt", "DESC"]],
        limit: 10,
        offset: (req.query.page - 1) * 10
      });
      count = await hashtag.countReviews();
    }

    return res.json({
      reviews,
      is_end:isEnd(parseInt(req.query.page), count)
    });
  } catch (error) {
    return next(error);
  }
};
