const joi=require('joi');

const { Hashtag } = require("../../models");

const isEnd=(page, reviews)=>{
  if(reviews.length===0){
    return true;
  } else{
    return page===Math.ceil(reviews.length/10)
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
    if (hashtag) {
      reviews = await hashtag.getReviews({
        order: [["createdAt", "DESC"]],
      });
    }

    return res.json({
      reviews:reviews.slice(((page-1)*10), (page*10)-1),
      is_end:isEnd(page, reviews)
    });
  } catch (error) {
    return next(error);
  }
};
