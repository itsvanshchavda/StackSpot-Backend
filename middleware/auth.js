import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decodedData.id;
    next();
  } catch(err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    } else {
      return res.status(500).json({ message: "Invalid token" });
    }
  }
};
