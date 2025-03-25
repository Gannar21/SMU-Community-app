const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    president_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    isActive: { type: Boolean, default: true },
    logo: { type: String }, // Store Base64 logo
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);
