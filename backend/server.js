// backend/server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const { getBTCinINR, getNiftyPrice } = require("./services/priceService");
const { getNSEStocks } = require("./services/stockService");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 15 NSE stock symbols
const STOCK_LIST = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "SBIN",
  "ITC",
  "LT",
  "HINDUNILVR",
  "TATAMOTORS",
  "MARUTI",
  "BAJFINANCE",
  "AXISBANK",
  "SUNPHARMA",
  "BHARTIARTL"
];

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  const interval = setInterval(async () => {
    try {
      // 1) BTC → INR
      const bitcoin = await getBTCinINR();

      // 2) NIFTY 50
      const nifty = await getNiftyPrice();

      // 3) NSE stocks
      const symbols = STOCK_LIST.map((s) => s + ".NS");
      const stocks = await getNSEStocks(symbols);

      // Send update to frontend
      socket.emit("dashboardUpdate", {
        bitcoin,
        nifty,
        stocks,
      });

    } catch (err) {
      console.error("❌ Live update error:", err.message);
      socket.emit("dashboardError", { message: "Update failed" });
    }
  }, 5000); // every 5 sec

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("❌ Client disconnected:", socket.id);
  });
});

// simple root route
app.get("/", (req, res) => {
  res.send("✅ Real-Time Backend is Running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
