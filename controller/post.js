import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";

export const writePost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.status(200).json({
      success: true,
      message: "Post created",
      newPost,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const updatePost = await Post.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatePost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      updatePost,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await Post.findByIdAndDelete(id);

    await Comment.deleteMany({ postId: id }); // delete all comments related to the post

    res.status(200).json({
      success: true,
      message: "Post deleted✅",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const getPost = await Post.findById(req.params.id);

    res.status(200).json({
      success: true,
      getPost,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const allPost = await Post.find();

    if (!allPost || allPost.length === 0) {
      return res.status(404).json({ message: "No post found" });
    }

    res.status(200).json({
      success: true,
      allPost,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getSearchedPost = async (req, res) => {
  const { search } = req.query;

  try {
    const searchedPost = await Post.find({
      title: { $regex: search, $options: "i" },
    });

    if (!searchedPost || searchedPost.length === 0) {
      return res.status(404).json({ message: "No post found" });
    }

    res.status(200).json({
      success: true,
      searchedPost,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const userPost = async (req, res) => {
  const { userId } = req.params;

  try {
    const userpost = await Post.find({ userId });

    res.status(200).json({
      success: true,
      userpost,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }
    res.status(200).json({
      success: true,
      message: "Image uploaded",
      img: req.file,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
