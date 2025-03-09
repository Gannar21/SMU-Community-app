const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { signUp, signIn } = require("../controllers/auth.controller.js");

const router = express.Router();

// Admin Login route (separate from signIn)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the admin user by email using the User model
    const admin = await User.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    // Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Ensure the user is an admin
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "You do not have admin access" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id }, "secret_key", { expiresIn: "1h" });
    res.status(200).json({ token, user: admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// /me route to get the logged-in user's profile
router.get("/me", async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, "secret_key");

    // Find the user by the decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Send the user profile data
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// SignUp and SignIn routes for normal users
router.post("/signup", signUp);
router.post("/signin", signIn);

module.exports = router;
