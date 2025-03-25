const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const router = express.Router();
const Club = require("../models/club.model"); // Ensure the path is correct

// Multer setup for handling image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store the images in a folder named 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Name the file with the current timestamp
  },
});

const upload = multer();

// POST route to add a new club with a logo
router.post("/", async (req, res) => {
  try {
    let { name, email, description, president_id, isActive, logo } = req.body;

    // If president_id is an empty string or undefined, set it to null
    if (!president_id || president_id.trim() === "") {
      president_id = null;
    }

    // If president_id is provided, validate its format
    if (president_id && !mongoose.Types.ObjectId.isValid(president_id)) {
      return res.status(400).json({ message: "Invalid president_id format" });
    }

    // If logo is a Base64 string, directly save it in the database
    if (logo && logo.startsWith("data:image")) {
      // Save the base64 string as it is
      logo = logo;
    } else {
      logo = null; // No logo provided
    }

    const newClub = new Club({
      name,
      email,
      description,
      president_id,
      isActive,
      logo, // Save the Base64 string in the logo field
    });

    const savedClub = await newClub.save();
    res.status(201).json(savedClub); // Return saved club data
  } catch (error) {
    console.error("Error saving club:", error);
    res.status(500).json({ message: "Failed to add club" });
  }
});


// GET route to fetch all clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find({});
    res.status(200).json(clubs);  // Return the array of clubs
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ message: "Error fetching clubs" });
  }
});
// DELETE route to delete a club by ID
router.delete("/:id", async (req, res) => {
  try {
    const clubId = req.params.id;
    
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    // Attempt to find and delete the club by its ID
    const deletedClub = await Club.findByIdAndDelete(clubId);

    if (!deletedClub) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const clubId = req.params.id;
    let { name, email, description, president_id, isActive } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    let club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // If president_id is empty or undefined, set it to null
    let updatedPresidentId = president_id && president_id.trim() !== "" ? president_id : null;

    // Validate president_id format
    if (updatedPresidentId && !mongoose.Types.ObjectId.isValid(updatedPresidentId)) {
      return res.status(400).json({ message: "Invalid president_id format" });
    }

    // If a new logo is uploaded, convert it to Base64
    let logo = club.logo; // Keep the old logo if no new file is uploaded
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      logo = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    // Build update object
    const updateData = { name, email, description, president_id: updatedPresidentId, isActive, logo };

    // Update the club
    const updatedClub = await Club.findByIdAndUpdate(clubId, updateData, { new: true });

    res.status(200).json(updatedClub);
  } catch (error) {
    console.error("Error updating club:", error);
    res.status(500).json({ message: "Server error", error });
  }
});




module.exports = router;