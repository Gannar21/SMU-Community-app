const Club = require("../models/club.model").Club || require("../models/club.model");
const mongoose = require("mongoose");

const getClubs = async (req, res) => {
    try {
        console.log("📌 Fetching all clubs...");
        const clubs = await Club.find({}).populate("president_id", "name email");
        console.log("✅ Clubs retrieved:", clubs);  // Log the clubs data
        res.status(200).json(clubs);
    } catch (error) {
        console.error("❌ Error fetching clubs:", error);
        res.status(500).json({ message: error.message });
    }
};



const getClub = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📌 Fetching club with ID: ${id}`);

        const club = await Club.findById(id).populate("president_id", "name email");
        if (!club) {
            console.log("❌ Club not found");
            return res.status(404).json({ message: "Club not found" });
        }

        console.log("✅ Club retrieved:", club);
        res.status(200).json(club);
    } catch (error) {
        console.error("❌ Error fetching club:", error);
        res.status(500).json({ message: error.message });
    }
};

const createClub = async (req, res) => {
    try {
        console.log("📌 Received request body:", req.body);

        const { name, email, description, president_id, isActive, logo } = req.body;
        if (!name || !email || !description) {
            return res.status(400).json({ message: "Missing required fields: name, email, description" });
        }

        // Validate Base64 format (optional)
        if (logo && !/^data:image\/[a-zA-Z]+;base64,/.test(logo)) {
            return res.status(400).json({ message: "Invalid logo format. Must be Base64 encoded." });
        }

        const newClub = new Club({
            name,
            email,
            description,
            logo, // Store Base64 string
            president_id,
            isActive,
        });

        await newClub.save();
        console.log("✅ Club created:", newClub);
        res.status(201).json(newClub);
    } catch (error) {
        console.error("❌ Error creating club:", error);
        res.status(500).json({ message: "Server Error" });
    }
};





const updateClub = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📌 Updating club with ID: ${id}`);

        const updateData = { ...req.body };

        // Validate Base64 format if a new logo is provided
        if (req.body.logo && !/^data:image\/[a-zA-Z]+;base64,/.test(req.body.logo)) {
            return res.status(400).json({ message: "Invalid logo format. Must be Base64 encoded." });
        }

        const club = await Club.findByIdAndUpdate(id, updateData, { new: true });
        if (!club) {
            console.log("❌ Club not found for update");
            return res.status(404).json({ message: "Club not found" });
        }

        console.log("✅ Club updated:", club);
        res.status(200).json(club);
    } catch (error) {
        console.error("❌ Error updating club:", error);
        res.status(500).json({ message: error.message });
    }
};


const deleteClub = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📌 Deleting club with ID: ${id}`);

        const club = await Club.findByIdAndDelete(id);
        if (!club) {
            console.log("❌ Club not found for deletion");
            return res.status(404).json({ message: "Club not found" });
        }

        console.log("✅ Club deleted:", club);
        res.status(200).json({ message: "Club deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting club:", error);
        res.status(500).json({ message: error.message });
    }
};

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
        // Validate organizerType
        if (organizerType !== "Club" && organizerType !== "University") {
            return res.status(400).json({ message: 'Invalid organizer type' });
        }

        // If organizer is a club, validate clubId
        if (organizerType === "Club") {
            const club = await Club.findById(clubId);
            if (!club) {
                return res.status(404).json({ message: 'Club not found' });
            }
        }

        const event = await Event.findByIdAndUpdate(
            id,
            {
                title,
                description,
                date,
                time,
                location,
                organizerType,
                clubId: organizerType === "Club" ? clubId : null,
            },
            { new: true } // Return the updated event
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

module.exports = {
    createEvent,
    getAllClubs,
    getEventsByMonth,
    getEventsByClubId,
    deleteEvent, // Add this
    updateEvent, // Add this
};