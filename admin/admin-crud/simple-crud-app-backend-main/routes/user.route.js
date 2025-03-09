const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller.js");

const router = express.Router();

router.get("/", getUsers); // Get all users
router.get("/:id", getUser); // Get user by ID
router.post("/", createUser); // Create new user
router.put("/:id", updateUser); // Update user by ID
router.delete("/:id", deleteUser); // Delete user by ID

module.exports = router;
