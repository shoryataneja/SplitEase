const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    console.log("[AUTH] Protect middleware called");
    console.log("[AUTH] Authorization header:", req.headers.authorization);
    
    // 1. check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("[AUTH] Token extracted:", token ? "Token exists" : "No token");
    }

    // 2. if no token
    if (!token) {
      console.log("[AUTH] No token provided");
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // 3. verify token
    console.log("[AUTH] Verifying token with JWT_SECRET...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[AUTH] Token verified, user ID:", decoded.id);

    // 4. get user from token
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      console.log("[AUTH] User not found in database");
      return res.status(401).json({
        message: "User not found",
      });
    }
    
    console.log("[AUTH] User authenticated:", req.user.email);
    next(); // allow request to continue
  } catch (error) {
    console.error("[AUTH] Token verification failed:", error.message);
    return res.status(401).json({
      message: "Not authorized, token failed",
      error: error.message,
    });
  }
};

module.exports = { protect };
