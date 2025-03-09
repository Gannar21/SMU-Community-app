const User = require("../models/user.model");

const getUsers = async (req, res) => {
  try {
    console.log("📌 Fetching all users...");
    const users = await User.find({});
    console.log("✅ Users retrieved:", users.length);
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📌 Fetching user with ID: ${id}`);

    const user = await User.findById(id);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User retrieved:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    console.log("📩 Received data:", req.body);

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already registered:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    console.log("✅ User created:", user);

    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📌 Updating user with ID: ${id}`);

    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      console.log("❌ User not found for update");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User updated:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📌 Deleting user with ID: ${id}`);

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      console.log("❌ User not found for deletion");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User deleted:", user);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
