const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    console.log("📌 Received Signup Request:", req.body); // Log request body

    const { name, email, phone, password, isAdmin } = req.body; // Ensure phone is included

    if (!name || !email || !phone || !password) {
      console.log("❌ Missing Fields:", { name, email, phone, password });
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already registered:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = isAdmin ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    console.log("✅ User Created:", user);
    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, "secret_key", { expiresIn: "1h" });

    // Send userId and token in the response
    res.status(200).json({
      userId: user._id,  // Explicitly send userId
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists (optional)
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin", // Set this user as admin
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "You do not have admin access" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signUp, signIn, createAdmin,signInUser };
