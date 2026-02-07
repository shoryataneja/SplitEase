const bcrypt = require("bcryptjs");
const User = require("../models/User");

// test controller (temporary)
const testAuth = (req, res) => {
  res.send("Auth controller working");
};

// signup controller
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. check if all fields exist
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3. hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. send response
    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  testAuth,
  signup,
};
