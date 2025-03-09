require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/auth.route.js");
const userRoute = require("./routes/user.route.js");
const clubRoute = require("./routes/club.route.js"); // Assuming you have this file
const eventRoute = require("./routes/event.route.js"); // Adding event route
const taskRoute = require("./routes/task.route.js"); // Add this line to import the task routes

const app = express();

// Debug: Check if .env is loaded correctly
console.log("📌 MongoDB URI:", process.env.MONGO_URI);

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL (Vite)
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Log incoming requests (for debugging)
app.use((req, res, next) => {
  console.log(`🔹 ${req.method} request to ${req.url}`);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoute);  // Authentication routes
app.use("/api/users", userRoute); // User CRUD routes
app.use("/api/clubs", clubRoute); // Club CRUD routes
app.use("/api/events", eventRoute); // Event CRUD routes
app.use("/api/tasks", taskRoute);  // Add this line for tasks routes

app.get("/", (req, res) => {
  res.send("Hello from Node API with Authentication, User, Club, Event, and Task Management");
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB!");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed!", error);
  });
