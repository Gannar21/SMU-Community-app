const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Validate time format (HH:MM) and minutes (00, 15, 30, 45)
                const timeRegex = /^([01]?[0-9]|2[0-3]):(00|15|30|45)$/;
                return timeRegex.test(value);
            },
            message: "Time must be in HH:MM format with minutes as 00, 15, 30, or 45.",
        },
    },
    location: {
        type: String,
        required: true,
    },
    organizerType: {
        type: String,
        enum: ["Club", "University"],
        required: true,
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club', // Reference to the Club model
        required: function() {
            return this.organizerType === "Club"; // Only required if organizerType is Club
        },
    },
    participants: {
        type: Number,
        default: 0, // Default to 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

