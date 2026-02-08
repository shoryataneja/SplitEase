const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    // 1. check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. if no token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // 3. verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. get user from token
    req.user = await User.findById(decoded.id).select("-password");

    next(); // allow request to continue
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

module.exports = { protect };
