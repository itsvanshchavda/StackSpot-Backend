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

    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Production" && true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };

   
    res.cookie("token", token, cookieOptions);

    res.status(status).json({
      success: true,
      message: message,
      token: token,
      user: user,
    });
  } catch (error) {
    console.error("Error setting cookie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set cookie",
      error: error.message,
    });
  }
};
