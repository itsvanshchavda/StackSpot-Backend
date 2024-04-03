import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("Database connected"))
      .catch((Err) => console.log("Database Error", Err));
  } catch (err) {
    console.log(err);
  }
};



