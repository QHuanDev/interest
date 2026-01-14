import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import productRoutes from "./routes/product.routes.js";

const __dirname = path.dirname(path.resolve());

const PORT = process.env.PORT || 5000;

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./FE/dist")));
  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./FE/dist/index.html"));
  });
}

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Product Management API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running`);
});
