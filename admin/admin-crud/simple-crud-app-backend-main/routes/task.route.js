const express = require("express");
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
} = require("../controllers/task.controller.js");

const router = express.Router();

router.get("/", getTasks); // Get all tasks
router.get("/:id", getTask); // Get task by ID
router.post("/", createTask); // Create a new task
router.put("/:id", updateTask); // Update a task by ID
router.delete("/:id", deleteTask); // Delete a task by ID

module.exports = router;
