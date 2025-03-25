const Task = require("../models/task.model");
const User = require("../models/user.model"); // Import the User model

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
    const { name, status, category, assignedTo, dueTo, priority, description } = req.body;

    const taskData = {
      name,
      status,
      category,
      assignedTo: assignedTo && assignedTo.userId ? assignedTo : null,
      dueTo,
      priority,
      description,
    };

    const task = new Task(taskData);
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: error.message });
  }
};

const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("Assigning task:", req.params.id, "to user:", userId); // Debugging

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId); // Debugging
      return res.status(404).json({ message: "User not found" });
    }

    // Update the task with the assigned user and set status to "In Progress"
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: { userId: user._id, name: user.name },
        status: "In Progress" // Update status to "In Progress"
      },
      { new: true } // Return the updated task
    );

    // Check if the task exists
    if (!task) {
      console.log("Task not found:", req.params.id); // Debugging
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("Task assigned successfully:", task); // Debugging

    // Return success response
    res.json({ message: "Task assigned successfully", task });
  } catch (error) {
    console.error("❌ Error assigning task:", error); // Debugging
    res.status(500).json({ message: "Error assigning task", error: error.message }); // Include error message
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📌 Updating task with ID: ${id}`);

    const updatedFields = req.body;

    const task = await Task.findByIdAndUpdate(id, updatedFields, { new: true });
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
  assignTask,
};