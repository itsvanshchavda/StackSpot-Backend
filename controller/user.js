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
    const { password } = req.body;
    if (!authUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPass = bcrypt.hashSync(password, salt);
      password = hashPass;
    }

    let updateFieds = { ...req.body };

    if (req.file) {
      const file = req.file;
      const filUri = getDataUri(file);
      const result = await cloudinary.uploader.upload(filUri.content, {
        folder: "profile",
        resource_type: "auto",
        use_filename: true,
        public_id: file.originalname.split(".")[0],
      });

      updateFieds.profilePhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateFieds },
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
export const deleteUser = async (req, res) => {
  let { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    await Post.findByIdAndDelete(id);
    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User has been deleted✅",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

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
