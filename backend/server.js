
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const { getBTCinINR, getNiftyPrice } = require("./services/priceService");
const { getNSEStocks } = require("./services/stockService");
const { getNifty } = require("./services/indexService");


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
  
      const bitcoin = await getBTCinINR();

      const nifty = await getNifty();

      const symbols = STOCK_LIST.map((s) => s + ".NS");
      const stocks = await getNSEStocks(symbols);

      socket.emit("dashboardUpdate", {
        bitcoin,
        nifty,
        stocks,
      });

    } catch (err) {
      console.error("❌ Live update error:", err.message);
      socket.emit("dashboardError", { message: "Update failed" });
    }
  }, 5000); 

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("❌ Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("✅ Real-Time Backend is Running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
