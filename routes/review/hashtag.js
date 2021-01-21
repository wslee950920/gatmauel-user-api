const { Hashtag } = require("../../models");

module.exports = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.status(204).end();
  }

  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let reviews = [];
    if (hashtag) {
      reviews = await hashtag.getReviews();
    }

    return res.json(reviews);
  } catch (error) {
    return next(error);
  }
};
