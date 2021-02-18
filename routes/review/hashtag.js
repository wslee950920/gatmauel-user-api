const { Hashtag } = require("../../models");

const isEnd=(page, reviews)=>{
  if(reviews.length===0){
    return true;
  } else{
    return page===Math.ceil(reviews.length/10)
  }
}

module.exports = async (req, res, next) => {
  const query = req.query.hashtag.toString();
  const page = parseInt(req.query.page.toString(), 10);

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
