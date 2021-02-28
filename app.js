const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const cors=require('cors');
const helmet=require('helmet');
const hpp=require('hpp');
require("dotenv").config();

const { sequelize } = require("./models");
const passportConfig = require("./passport");
const checkDelete = require("./lib/checkDelete");
const logger=require('./logger');

const app = express();
app.set("port", process.env.PORT || 9090);

sequelize.sync();
passportConfig(passport);
checkDelete();

const jwtMiddleware = require("./lib/jwtMiddleware");
const authRouter = require("./routes/auth");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const orderRouter = require('./routes/order');

app.use(cors({
  origin:true,
  credentials:true,
  exposedHeaders:['Last-Page']
}));
if(process.env.NODE_ENV==='production'){
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
} else{
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption={
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    secure: false,
  }
}
if (process.env.NODE_ENV === "production") {
  const Redis = require("ioredis");
  const RedisStore = require("connect-redis")(session);

  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;

  const cluster = new Redis.Cluster([
    {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST_1,
    },
    {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST_2,
    },
    {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST_3,
    },
  ]);
  sessionOption.store = new RedisStore({ client: cluster });
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(jwtMiddleware);

app.use("/@user/auth", authRouter);
app.use("/@user/review", reviewRouter);
app.use("/@user/user", userRouter);
app.use('/@user/order', orderRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;

  next(err);
});

app.use((err, req, res) => {
  if(process.env.NODE_ENV==='production'){
    logger.error(err.message);
  }

  const error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.send(error);
});

app.listen(app.get("port"));
