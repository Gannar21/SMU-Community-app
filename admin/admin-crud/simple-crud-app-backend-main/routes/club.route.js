const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage"); // Correct import
const Grid = require("gridfs-stream");
const path = require("path");
const Club = require("../models/club.model.js");  // Adjusted to match the correct file name

// Setup GridFS storage
const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); // GridFS collection name
});

// Multer storage for file uploads
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    // Validate the file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return Promise.reject(new Error('Only image files are allowed.'));
    }

    return {
      bucketName: "uploads",
      filename: `${Date.now()}${path.extname(file.originalname)}`, // Ensure file extension is included
    };
  },
});

const upload = multer({ storage });

// POST route to add a new club
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const { name, email, description, president_id, isActive } = req.body;

    // Handle case where no file is uploaded
    const logo = req.file ? req.file.id : null; // Store GridFS file ID if file is uploaded

    const newClub = new Club({
      name,
      email,
      description,
      president_id,
      isActive,
      logo, // Store logo ID or null if no file uploaded
    });

    const savedClub = await newClub.save();
    res.status(201).json(savedClub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add club" });
  }
});

// **Logo Retrieval Endpoint**: Serve the logo image from GridFS
router.get("/logo/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).json({ error: "File not found" });

    const readstream = gfs.openDownloadStream(file._id);
    res.set("Content-Type", file.contentType);
    readstream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving logo" });
  }
});

console.log("📌 Club Route Loaded");
module.exports = router;
router.get("/", (req, res) => {
  res.status(200).json({ message: "Clubs API is working!" });
});
