const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("node:path");

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
app.use("/admin", express.static(adminPath));

const storefrontPath = path.join(__dirname, "..", "..");
app.use(express.static(storefrontPath));

app.get("/", (_req, res) => {
  res.sendFile(path.join(storefrontPath, "index.html"));
});

module.exports = app;
