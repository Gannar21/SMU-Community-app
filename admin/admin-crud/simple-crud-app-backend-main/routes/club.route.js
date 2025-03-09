const express = require("express");
const {
    getClubs,
    getClub,
    createClub,
    updateClub,
    deleteClub,
} = require("../controllers/club.controller.js");

const router = express.Router();

router.get("/", getClubs); // Get all clubs
router.get("/:id", getClub); // Get club by ID
router.post("/", createClub); // Create new club
router.put("/:id", updateClub); // Update club by ID
router.delete("/:id", deleteClub); // Delete club by ID

module.exports = router;
