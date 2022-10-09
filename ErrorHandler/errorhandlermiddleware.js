const AppError = require("./AppError");

//handle the cast error Error from database
const CastErrorDatabase = (error) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

//handle the validation error Error from database

const ValidationErrorDatabase = (error) => {
  const message = `Invalid Input Error: ${error.message}`;
  return new AppError(message, 400);
};
//hanldw invalid token of jwt
const JsonWebTokenError = (error) => {
  return res.status(401).json({
    status: "Error",
    message: "invalid token please login with valid credentials ",
  });
};
//if token valid time expires this error triggers
const TokenExpiredError = (err) => {
  return res.status(401).json({
    status: "error",
    message: "Token expired .You need to login again ",
  });
};

//handle the duplicate mongodb error of status code 11000
const DuplicateMongodbError = (err) => {
  return res.status(400).json({
    status: "Error",
    message: "user already exist try with another username and email ",
  });
};

const sendErrorDev = (err, res) => {
  console.error("Error: ", err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    errorName: err.name,
  });
};
const sendErrorProd = (err, res) => {
  //operational error:sending to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //programming error :NOt sending error to client
  else {
    //1) logging error for developer
    console.error("Error :", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong ",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    if (err.name === "CastError") {
      CastErrorDatabase(err);
    }
    if (err.name === "ValiationError") {
      ValidationErrorDatabase(err);
    }
    if (err.name === "JsonWebTokenError") {
      JsonWebTokenError(err);
    }
    if (err.name === "TokenExpiredError") {
      TokenExpiredError(err);
    }
    if (err.code === 11000) {
      DuplicateMongodbError(err);
    }
    sendErrorProd(err, res);
  }
};
