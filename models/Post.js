import mongoose from "mongoose";

const postShema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      unique: true,
    },

    photo: {
      type: String,
      required: false,
    },

    username: {
      type: String,
      required: true,
    },

    firstname: { 
      type: String,
      required: true,
    },

    profilePhoto: { 
      type: String,
    },

    lastname: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postShema);
