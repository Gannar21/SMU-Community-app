const express = require('express');
const {

  createEvent,
  getAllClubs,
  getEventsByClubId,
  getEventsByMonth,
  deleteEvent,
  updateEvent,
  getAllEvents,
  getEventById, // Import new function
} = require('../controllers/event.controller');

const router = express.Router();

// Get all events
router.get('/', getAllEvents);

// Get events for a specific month and year
router.get('/month', getEventsByMonth);

// Get all clubs (to extract club IDs)
router.get('/clubs', getAllClubs);

// Create a new event
router.post('/', createEvent);

// Get events by club ID
router.get('/club/:clubId', getEventsByClubId);

// Get event details by ID
router.get('/:id', getEventById);

// Delete an event by ID
router.delete('/:id', deleteEvent);

// Update an event by ID
router.put('/:id', updateEvent);
// Add this to event.routes.js


module.exports = router;