const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const cors=require('cors');
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

app.use(cors({
  origin:true,
  credentials:true,
  exposedHeaders:['Last-Page']
}));
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
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(jwtMiddleware);

app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);
app.use("/api/user", userRouter);
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

app.listen(app.get("port"));
