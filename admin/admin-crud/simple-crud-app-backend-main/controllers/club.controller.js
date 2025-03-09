const Club = require("../models/club.model").Club || require("../models/club.model");
const mongoose = require("mongoose");

const getClubs = async (req, res) => {
    try {
        console.log("📌 Fetching all clubs...");
        const clubs = await Club.find({}).populate("president_id", "name email");
        console.log("✅ Clubs retrieved:", clubs.length);
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
      const { name, email, description, logo } = req.body;
  
      const club = new Club({
        name,
        email,
        description,
        logo
      });
  
      await club.save();
      console.log("✅ Club created:", club);
      res.status(201).json(club);
    } catch (error) {
      console.error("❌ Error creating club:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  

const updateClub = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📌 Updating club with ID: ${id}`);

        const club = await Club.findByIdAndUpdate(id, req.body, { new: true });
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

module.exports = {
    getClubs,
    getClub,
    createClub,
    updateClub,
    deleteClub,
};

