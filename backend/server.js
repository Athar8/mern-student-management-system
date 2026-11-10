require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Uploads Folder Public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/studentdb")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Student Routes
const studentRoutes = require("./routes/studentRoutes");
app.use("/students", studentRoutes);

// Authentication Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});