const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const driverRoutes = require("./routes/driverRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Base route
app.get("/", (req, res) => {
  res.send("🚗 MERN Backend Running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/drivers", driverRoutes);

// ⚠️ Vercel-compatible export (NO app.listen!)
const server = require("http").createServer(app);

// 🔁 This allows Vercel to handle requests
module.exports = (req, res) => {
  // 🔁 Ensure DB is connected on each request
  if (mongoose.connection.readyState === 0) {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("✅ MongoDB Connected");
        server.emit("request", req, res);
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        res.status(500).send("Database connection failed");
      });
  } else {
    server.emit("request", req, res);
  }
};
