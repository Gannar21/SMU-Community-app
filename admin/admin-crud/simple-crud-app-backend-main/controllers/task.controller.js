const Task = require("../models/task.model");
const mongoose = require("mongoose");

const getTasks = async (req, res) => {
  try {
    console.log("📌 Fetching all tasks...");
    const tasks = await Task.find({});
    console.log("✅ Tasks retrieved:", tasks.length);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📌 Fetching task with ID: ${id}`);

    const task = await Task.findById(id);
    if (!task) {
      console.log("❌ Task not found");
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("✅ Task retrieved:", task);
    res.status(200).json(task);
  } catch (error) {
    console.error("❌ Error fetching task:", error);
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { name, status, deadline, category, assignedTo, dueTo, priority, comments, progress, description } = req.body;

    // Ensure that description is provided
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const task = new Task({
      name,
      status,
      deadline,
      category,
      assignedTo,
      dueTo,
      priority,
      comments,
      progress,
      description,  // Add description to the task object
    });

    await task.save();
    console.log("✅ Task created:", task);
    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📌 Updating task with ID: ${id}`);

    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) {
      console.log("❌ Task not found for update");
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("✅ Task updated:", task);
    res.status(200).json(task);
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📌 Deleting task with ID: ${id}`);

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      console.log("❌ Task not found for deletion");
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("✅ Task deleted:", task);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
