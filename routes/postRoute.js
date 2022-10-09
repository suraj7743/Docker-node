const express = require("express");
const router = express();
const postController = require("../controllers/PostController");
const protect = require("../middleware/authmiddleware");

router.get("/", postController.getAllPost);
router.post("/", protect, postController.postNewPost);
router.patch("/:id", protect, postController.updatePost);
router.delete("/:id", protect, postController.deletePost);
router.get("/:id", protect, postController.getSinglePost);

module.exports = router;
