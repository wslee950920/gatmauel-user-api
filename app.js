const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const { sequelize } = require("./models");
const passportConfig = require("./passport");
const checkDelete = require("./lib/checkDelete");

const app = express();
sequelize.sync();
passportConfig(passport);
checkDelete();

app.set("port", process.env.PORT || 9090);

const jwtMiddleware = require("./lib/jwtMiddleware");
const authRouter = require("./routes/auth");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const commentRouter = require("./routes/comment");

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      //세션에 저장되어 있는 정보를 불러오기 위한 세션id 쿠키의 옵션
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
      secure: false,
      //signed:true옵션을 주든 말든 '세션 쿠키'에 서명한다.
    },
  })
);
app.use(passport.initialize());
//app.use(passport.session());
app.use(jwtMiddleware);

app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);
app.use("/api/user", userRouter);
app.use("/api/comment", commentRouter);
app.use("/api", (req, res, next) => {
  res.send("api root directory");
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;

  next(err);
});

app.use((err, req, res) => {
  const error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send(error);
});

app.listen(app.get("port"), () => {
  console.log("port", app.get("port"));
});
