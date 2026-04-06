const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("node:path");
const fs = require("node:fs");

const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const couponsRoutes = require("./routes/couponsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const publicRoutes = require("./routes/publicRoutes");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const uploadsPath = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", publicRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/admin/products", productsRoutes);
app.use("/api/admin/coupons", couponsRoutes);
app.use("/api/admin/categories", categoriesRoutes);

const adminPath = path.join(__dirname, "..", "..", "admin");
if (fs.existsSync(adminPath)) {
  app.use("/admin", express.static(adminPath));
} else {
  app.get("/admin", (_req, res) => {
    res.status(404).json({ message: "Admin static files not found in this deployment" });
  });
}

const storefrontPath = path.join(__dirname, "..", "..");
const storefrontIndexPath = path.join(storefrontPath, "index.html");

if (fs.existsSync(storefrontIndexPath)) {
  app.use(express.static(storefrontPath));
}

app.get("/", (_req, res) => {
  if (fs.existsSync(storefrontIndexPath)) {
    return res.sendFile(storefrontIndexPath);
  }

  return res.json({
    status: "ok",
    message: "Backend is running",
    health: "/api/health"
  });
});

module.exports = app;
