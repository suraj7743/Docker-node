const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: [true, "user must have a username "],
    unique: [true, "Usename must be unique"],
  },
  password: {
    type: String,
    require: [true, "User must have a password "],
  },
});

userSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
    this.passwordChangedDate = Date.now() - 1000;
  } else {
    return next();
  }
});
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
