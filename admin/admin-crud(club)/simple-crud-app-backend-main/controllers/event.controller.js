const Event = require('../models/event.model');
const Club = require('../models/club.model');

// Fetch events for a specific month and year
const getEventsByMonth = async (req, res) => {
    const { month, year } = req.query;
  
    // Log the query parameters for debugging
    console.log(`Fetching events for month: ${month}, year: ${year}`);
  
    // Validate month and year
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required query parameters.' });
    }
  
    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);
  
    if (isNaN(monthNumber)) {
      return res.status(400).json({ message: 'Month must be a valid number.' });
    }
  
    if (isNaN(yearNumber)) {
      return res.status(400).json({ message: 'Year must be a valid number.' });
    }
  
    // Validate month range (1-12)
    if (monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ message: 'Month must be between 1 and 12.' });
    }
  
    try {
      // Construct date range
      const startDate = new Date(yearNumber, monthNumber - 1, 1); // Start of the month
      const endDate = new Date(yearNumber, monthNumber, 0); // End of the month
  
      // Log the constructed dates for debugging
      console.log(`Start date: ${startDate}, End date: ${endDate}`);
  
      // Fetch events within the date range
      const events = await Event.find({
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      });
  
      res.status(200).json(events);
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      res.status(500).json({ message: error.message });
    }
  };

// Fetch all clubs
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({});
    const clubIds = clubs.map((club) => ({
      _id: club._id,
      name: club.name,
    }));
    res.status(200).json(clubIds);
  } catch (error) {
    console.error('❌ Error fetching clubs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new event
const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };
  
  const createEvent = async (req, res) => {
    try {
      const { title, description, date, time, location, organizerType, clubId } = req.body;
  
      // Validate date
      if (!isValidDate(new Date(date))) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
  
      // Validate organizerType
      if (organizerType !== 'Club' && organizerType !== 'University') {
        return res.status(400).json({ message: 'Invalid organizer type' });
      }
  
      // If organizer is a club, validate clubId
      if (organizerType === 'Club') {
        const club = await Club.findById(clubId);
        if (!club) {
          return res.status(404).json({ message: 'Club not found' });
        }
      }
  
      // Create the event
      const event = new Event({
        title,
        description,
        date,
        time,
        location,
        organizerType,
        clubId: organizerType === 'Club' ? clubId : null,
        participants: 0,
      });
  
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      console.error('❌ Error creating event:', error);
      res.status(500).json({ message: error.message });
    }
  };

// Fetch events by club ID
const getEventsByClubId = async (req, res) => {
  const { clubId } = req.params;

  try {
    const events = await Event.find({ clubId }).populate('clubId', 'name'); // Populate club namelogo
    res.status(200).json(events);
  } catch (error) {
    console.error('❌ Error fetching events by club ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update an event by ID
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, time, location, organizerType, clubId } = req.body;
  
    try {
      // Validate date
      if (!isValidDate(new Date(date))) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
  
      // Validate organizerType
      if (organizerType !== 'Club' && organizerType !== 'University') {
        return res.status(400).json({ message: 'Invalid organizer type' });
      }
  
      // If organizer is a club, validate clubId
      if (organizerType === 'Club') {
        const club = await Club.findById(clubId);
        if (!club) {
          return res.status(404).json({ message: 'Club not found' });
        }
      }
  
      // Update the event
      const event = await Event.findByIdAndUpdate(
        id,
        {
          title,
          description,
          date,
          time,
          location,
          organizerType,
          clubId: organizerType === 'Club' ? clubId : null,
        },
        { new: true }
      );
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error('❌ Error updating event:', error);
      res.status(500).json({ message: error.message });
    }
  };
// Fetch all events
const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find({}).sort({ date: 1 }); // Sort events by date (ascending)
      res.status(200).json(events);
    } catch (error) {
      console.error('❌ Error fetching all events:', error);
      res.status(500).json({ message: 'Failed to fetch events. Please try again later.' });
    }
  };

  
  
// Fetch event details by ID
const getEventById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const event = await Event.findById(id).populate('clubId', 'name logo'); // Include club logo
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json(event);
    } catch (error) {
      console.error('❌ Error fetching event details:', error);
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  createEvent,
  getAllClubs,
  getEventsByMonth,
  getEventsByClubId,
  deleteEvent,
  updateEvent,
  getAllEvents, // Ensure this is exported
  getEventById,
};