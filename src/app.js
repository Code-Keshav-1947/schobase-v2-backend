const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const { NotFoundError } = require("./utils/errors");
const db = require("./modules/prisma/db");
const cookieParser = require("cookie-parser");

// Import route modules
const authRoutes = require("./modules/auth/auth.routes");
const studentRoutes = require("./modules/student/student.routes");
const schoolRoutes = require("./modules/school/school.routes");
const classRoutes = require("./modules/class/class.routes");
const teacherRoutes = require("./modules/teacher/teacher.routes");

// Connect to the database
db.$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message || err);
  });

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    healthy: true,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/teachers", teacherRoutes);
// Catch 404 for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global Error handling middleware
app.use(errorHandler);

module.exports = app;
