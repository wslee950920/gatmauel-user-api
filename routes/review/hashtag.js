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
    page:joi.number().required()
  });
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).end();
  }

  const query = req.body.hashtag.toString();
  const page = parseInt(req.body.page.toString(), 10);
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let reviews = [];
    let count=0;
    if (hashtag) {
      reviews = await hashtag.getReviews({
        order: [["createdAt", "DESC"]],
        limit: 10,
        offset: (page - 1) * 10
      });
      count = await hashtag.countReviews()
    }

    return res.json({
      reviews,
      is_end:isEnd(page, count)
    });
  } catch (error) {
    return next(error);
  }
};
