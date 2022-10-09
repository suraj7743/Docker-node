const catchAsync = require("../ErrorHandler/CatchAsync");
const AppError = require("../ErrorHandler/AppError");

const protect = catchAsync(async (req, res, next) => {
  const { user } = req.session;
  if (!user) {
    return next(
      new AppError("You are not authorized Try login and procced", 401)
    );
  }
  req.user = user;
  next();
});

module.exports = protect;
