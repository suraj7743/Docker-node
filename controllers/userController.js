const catchAsync = require("../ErrorHandler/CatchAsync");
const AppError = require("../ErrorHandler/AppError");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const signup = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    return next(
      new AppError("Username already exist .enter another name ", 400)
    );
  }
  const userdata = new UserModel({
    username,
    password,
  });
  const data = await userdata.save();
  req.session.user = data;
  res.status(201).json({
    status: "success",
    message: "user signup",
    data,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({
    username,
  });
  if (!user) {
    return next(new AppError("Username doesnot exist Enter valid name "));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Password doesnot match !!!", 400));
  }
  req.session.user = user;
  res.status(201).json({
    status: "success",
    message: "user Logged in ",
  });
});

module.exports = {
  signup,
  login,
};
