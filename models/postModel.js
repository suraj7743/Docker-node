const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  title: {
    type: String,
    require: [true, "title required"],
  },
  body: {
    type: String,
    require: [true, "post must have body"],
  },
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
