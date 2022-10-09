const express = require("express");
const dotenv = require("dotenv").config({ path: "./.env" });
const PostRouter = require("./routes/postRoute");
const userRouter = require("./routes/userRoute");
const errorhandler = require("./ErrorHandler/errorhandlermiddleware");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const redis = require("redis");
const { REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");
let RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});
process.on("uncaughtException", (err) => {
  console.log("uncaught Exception ");
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1);
});

//middleware starts
app.use(cookieParser());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: SESSION_SECRET,
    resave: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60000 * 60 * 24 * 7, //valid for 7 days
    },
  })
);
app.use(express.json());
app.enable("trust proxy");
//handled the posts route
app.use("/api/v1/posts", PostRouter);

//handle the user login and signup post
app.use("/api/v1/user", userRouter);

//unhandled routes
app.all("*", (req, res, next) => {
  res.status(400).json({
    status: "error",
    message: `Cannot find the ${req.originalUrl}on this server`,
  });
});
app.use(errorhandler);
module.exports = app;
