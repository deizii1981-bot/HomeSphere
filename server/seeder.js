import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import listingRoutes from "./routes/listingRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ✅ FIX: allow frontend (5174) to talk to backend (5000)
app.use(cors());

// Middleware
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/staysphere")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

