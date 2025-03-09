const Event = require("../models/event.model"); // 🔥 Import the Event model here
const express = require('express');
const {
  createEvent,
  getAllClubs,
  getEventsByMonth,  // Add this import
} = require('../controllers/event.controller');

const router = express.Router();

// Get events for a specific month and year
router.get("/", async (req, res) => {
    try {
      const events = await Event.find({});
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Get all clubs (to extract club IDs)
router.get('/clubs', getAllClubs);

// Create a new event
router.post('/', createEvent);

module.exports = router;
