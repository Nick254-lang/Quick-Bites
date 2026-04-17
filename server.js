require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const { db } = require("./config/firebaseAdmin");

const app = express();

app.use(cors());
app.use(express.json());

// ================= STATIC FRONTEND =================
app.use(express.static(path.join(__dirname, "client")));

// ================= ROUTES =================

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/pages/home.html"));
});

// Test route
app.get("/test", (req, res) => {
  res.send("Server running 🚀");
});

// Create order
app.post("/api/orders/create", async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    const orderRef = await db.collection("orders").add({
      userId,
      items,
      total,
      status: "pending",
      createdAt: new Date(),
    });

    res.json({ orderId: orderRef.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});