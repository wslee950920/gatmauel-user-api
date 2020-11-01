module.exports = (req, res, next) => {
  const user = res.locals.user;
  const review = res.locals.review;

  if (review.userId !== user.id) {
    return res.status(403).end();
  }

  return next();
};
