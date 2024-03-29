import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";

//Update User

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password, firstname, lastname, email, bio, username } = req.body;

  try {
    let profilePhoto = req.body.profilePhoto; // Initialize profilePhoto

    // Handle file upload
    if (req.file) {
      const filename = req.file.path.split("\\").pop();
      profilePhoto = filename;
    }

    // Hash password
    const hashPass = bcrypt.hashSync(password, 10);

    // Update user
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username: username,
          firstname: firstname,
          lastname: lastname,
          email: email,
          bio: bio,
          profilePhoto: profilePhoto,
          password: hashPass,
        },
      },
      { new: true }
    );

    // Check if user was updated successfully
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: user,
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

export const uploadProfilePhoto = (req, res) => {
  if (req.file) {
    res.status(200).json({
      success: true,
      profilePhoto: req.file.filename,
    });
  }
};
