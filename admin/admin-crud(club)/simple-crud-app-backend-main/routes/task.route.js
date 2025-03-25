const express = require("express");
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
} = require("../controllers/task.controller.js");

const router = express.Router();

router.get("/", getTasks); // Get all tasks
router.get("/:id", getTask); // Get task by ID
router.post("/", createTask); // Create a new task
router.put("/:id", updateTask); // Update a task by ID
router.delete("/:id", deleteTask); // Delete a task by ID

router.put("/:id/assign", assignTask); // Assign a task to a user

module.exports = router;
