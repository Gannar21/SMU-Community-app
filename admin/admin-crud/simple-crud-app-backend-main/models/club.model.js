const mongoose = require("mongoose"); // <-- Add this line

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },  // Store logo as ObjectId referencing GridFS
    president_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Club", clubSchema);
