require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/auth.route.js");
const userRoute = require("./routes/user.route.js");
const clubRoute = require("./routes/club.route.js");
const eventRoute = require("./routes/event.route.js");
const taskRoute = require("./routes/task.route.js");

const app = express();

// Debug: Check if .env is loaded correctly
console.log("📌 MongoDB URI:", process.env.MONGO_URI);

// Enable CORS
const allowedOrigins = [
  "http://localhost:5173", // Vite frontend (Admin dashboard)
  "http://localhost:8081", // React Native Metro bundler
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Log incoming requests (for debugging)
app.use((req, res, next) => {
  console.log(`🔹 ${req.method} request to ${req.url}`);
  next();
});

// Increase request size limit to handle large payloads
app.use(express.json({ limit: "10mb" })); // Increase JSON request size limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded request size limit

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/clubs", clubRoute);
app.use("/api/events", eventRoute);
app.use("/api/tasks", taskRoute);

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

// Debug incoming request origins
app.use((req, res, next) => {
  console.log(req.headers.origin);
  next();
});
