const local = require("./localStrategy");
const kakao = require("./KaKaoStrategy");
const { User } = require("../models");

module.exports = (passport) => {
  local(passport);
  kakao(passport);
};
