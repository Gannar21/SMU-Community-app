const Event = require('../models/event.model');
const Club = require('../models/club.model');

// Fetch all clubs to extract club IDs
const getEventsByMonth = async (req, res) => {
    const { month, year } = req.query;
  
    try {
      const events = await Event.find({
        date: {
          $gte: new Date(year, month - 1, 1), // Start of the month
          $lt: new Date(year, month, 0), // End of the month
        },
      });
  
      res.status(200).json(events);
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      res.status(500).json({ message: error.message });
    }
  };

const getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find({});
        const clubIds = clubs.map(club => ({
            _id: club._id,
            name: club.name,
        }));
        res.status(200).json(clubIds);
    } catch (error) {
        console.error('❌ Error fetching clubs:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new event (now including valid clubId from existing clubs)
const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, clubId } = req.body;

        // Ensure clubId is valid (exists in the database)
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Create the event
        const event = new Event({
            title,
            description,
            date,
            time,
            location,
            clubId,
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('❌ Error creating event:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    getAllClubs,
    getEventsByMonth,
};
