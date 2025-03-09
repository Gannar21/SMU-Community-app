const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  deadline: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ['club', 'administrative'],
    required: true,
  },
  assignedTo: {
    type: String, // You can store either the username or 'Pending' if no one is assigned
    default: 'Pending',
  },
  timeUploaded: {
    type: Date,
    default: Date.now,
  },
  dueTo: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  comments: {
    type: String,
    default: '',
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
