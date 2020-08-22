const { Review } = require("../../models");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).send("리뷰를 찾을 수 없습니다.");
    }

    res.send(review);
  } catch (e) {
    console.error(e);

    next(e);
  }
};
