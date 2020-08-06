const Logout = async (req, res, next) => {
  await res.clearCookie("access_token");
  res.status(204).end();
};

module.exports = Logout;
