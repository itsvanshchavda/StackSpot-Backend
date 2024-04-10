import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { v2 as cloudinary } from "cloudinary";
import getDataUri from "../utils/dataUri.js";

// Update User
export const updateUser = async (req, res) => {
  try {
    let { id } = req.params;

    let authUser = await User.findById(id);
    let { password } = req.body;
    let updateFields = { ...req.body };

    if (!authUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!req.body.password) {
      delete updateFields.password;
    }

    if (req.body.password) {
      const hashPass = bcrypt.hash(password, 10);
      updateFields.password = hashPass;
    }

    if (req.file) {
      const file = req.file;
      const filUri = getDataUri(file);
      const result = await cloudinary.uploader.upload(filUri.content, {
        folder: "profile",
        resource_type: "auto",
        use_filename: true,
        public_id: file.originalname.split(".")[0],
      });

      updateFields.profilePhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//delete user

//get user
export const getUser = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (req.file) {
      const file = req.file;
      const filUri = getDataUri(file);
      const result = await cloudinary.uploader.upload(filUri.content, {
        folder: "profile",
        resource_type: "auto",
        use_filename: true,
        public_id: file.originalname.split(".")[0],
      });

      return res.json({
        success: true,
        profilePhoto: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.userId } });

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      success: true,
      allUsers,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getSearchedUser = async (req, res) => {
  const { search } = req.query;

  try {
    const searchedUser = await User.find({
      $or: [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    });

    if (!searchedUser || searchedUser.length === 0) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json({
      success: true,
      searchedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



