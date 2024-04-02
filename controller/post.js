import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

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

    await Comment.deleteMany({ postId: id });

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
    const postId = req.params.id;
    const getPost = await Post.findById(postId).populate(
      "likes bookmarks"
    );

    res.status(200).json({
      success: true,
      getPost,
      likeCount: getPost.likeCount || 0,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const allPost = await Post.find().populate("likes bookmarks")

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

// Post Like
export const likePost = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    const { id } = req.params;

    if (!user) return res.status(400).json({ message: "User not found" });

    // Verify the existence of the post
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(400).json({
        success: false,
        message: "Post does not exist",
      });
    }

    const likedPost = await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: { likes: user._id },
      },
      { new: true }
    )

    if (!likedPost) {
      return res.status(400).json({
        success: false,
        message: "Failed to update likes",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post Liked",
      likedPost,
    });
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const unlikePost = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    const { id } = req.params;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const unlike = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { likes: user._id },
      },
      { new: true }
    )

    if (unlike) {
      return res.status(200).json({
        message: "Post Unliked",
        unlike,
      });
    }
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Post Bookmark
export const addBookmark = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    const { id } = req.params;

    if (!user) return res.status(400).json({ message: "User not found" });

    // Verify the existence of the post
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(400).json({
        success: false,
        message: "Post does not exist",
      });
    }

    const bookmark = await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: { bookmarks: user._id },
      },
      { new: true }
    ).populate("bookmarks")

    if (!bookmark) {
      return res.status(400).json({
        success: false,
        message: "Failed to add bookmark",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post Bookmarked",
      bookmark,
    });
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    const { id } = req.params;

    if (!user) return res.status(400).json({ message: "User not found" });

    // Verify the existence of the post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post does not exist",
      });
    }

    const bookmark = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { bookmarks: user._id },
      },
      { new: true }
    ).populate('bookmarks')

    if (!bookmark) {
      return res.status(400).json({
        success: false,
        message: "Failed to add bookmark",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookmark removed",
      bookmark,
    });
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
  try {
    const userpPost = await Post.find({ userId: req.params.userID });

    if (!userpPost || userpPost.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User post not found",
      });
    }

    res.status(200).json({
      success: true,
      userPost: userpPost,
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
