module.exports = (req, res, next) => {
  const user = req.user;
  const review = req.review;

  if (review.userId !== user.id) {
    return res.status(403).send("접근 권한이 없습니다.");
  }

  return next();
};
