const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Trip = require("../models/Trip");
const jwt = require("jsonwebtoken");


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


// login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check if fields exist
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // 3. compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // 4. generate token
    const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
    );

    // 5. success response
    res.status(200).json({
    message: "Login successful",
    token,
    userId: user._id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// get current user
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// update name
const updateName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// delete account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Remove user from all trips
    await Trip.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Account deleted successfully",
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
  login,
  getMe,
  updateName,
  changePassword,
  deleteAccount
};
