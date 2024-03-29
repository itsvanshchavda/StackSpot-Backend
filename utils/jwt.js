import jwt from "jsonwebtoken";

export const setCookie = async (
  req,
  res,
  user,
  message = "Cookie set!",
  status = 200
) => {
  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "30d",
    });

    // Set cookie options based on environment
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    // Set the cookie in the response
    res.cookie("token", token, cookieOptions);

    // Send response with success message, token, and user data
    res.status(status).json({
      success: true,
      message: message,
      token: token,
      user: user,
    });
  } catch (error) {
    // Handle error if setting cookie fails
    console.error("Error setting cookie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set cookie",
      error: error.message,
    });
  }
};
