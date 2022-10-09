const PostModel = require("../models/postModel");
const catchAsync = require("../ErrorHandler/CatchAsync");
const AppError = require("../ErrorHandler/AppError");

const getAllPost = catchAsync(async (req, res, next) => {
  const post = await PostModel.find();
  res.status(200).json({
    status: "success",
    result: post.length,
    data: post,
  });
});

const postNewPost = catchAsync(async (req, res, next) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return next(new AppError("Enter all field", 400));
  }
  const post = new PostModel({
    title,
    body,
  });
  const data = await post.save();
  res.status(200).json({
    status: "success",
    result: data.length,
    message: "Post posted",
    data,
  });
});

const getSinglePost = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const post = await PostModel.findById({ _id: id });
  if (!post) {
    return next(new AppError("Sorry cannot find the user with given id ", 400));
  }
  res.status(200).json({
    status: "success",
    result: post.length,
    data: post,
  });
});

const deletePost = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const post = await PostModel.findById({ _id: id });
  if (!post) {
    return next(new AppError("Not valid id to delet this post", 400));
  }
  const deleteById = await PostModel.findByIdAndDelete({ _id: id });
  res.status(200).json({
    status: "success",
    message: "Post deleted",
  });
});

const updatePost = catchAsync(async (req, res, nex) => {
  const id = req.params.id;
  const post = await PostModel.findById({ _id: id });
  if (!post) {
    return next(
      new AppError("Cannot find the post with give id try again", 400)
    );
  }
  const data = await PostModel.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        title: req.body.title,
        body: req.body.body,
      },
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    message: "Post updated",
    data,
  });
});

module.exports = {
  getAllPost,
  postNewPost,
  getSinglePost,
  deletePost,
  updatePost,
};
