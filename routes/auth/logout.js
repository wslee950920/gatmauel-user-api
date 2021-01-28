const Logout = async (req, res, next) => {
  return res.clearCookie("access_token").status(204).end();
};

module.exports = Logout;
