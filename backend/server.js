const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const { getBTCinINR } = require("./services/priceService");
const { getIndianStock } = require("./services/stockService");
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

// --- 15 Stocks to fetch ---
const STOCK_LIST = [
  "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK",
  "SBIN", "ITC", "LT", "HINDUNILVR", "TATAMOTORS",
  "MARUTI", "BAJFINANCE", "AXISBANK", "SUNPHARMA", "BHARTIARTL"
];

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  const interval = setInterval(async () => {
    try {
      const bitcoin = await getBTCinINR();
      const nifty = await getNifty();

      const stockPromises = STOCK_LIST.map((sym) => getIndianStock(sym));
      const stockResults = await Promise.all(stockPromises);

      const stocks = STOCK_LIST.map((sym, idx) => ({
        symbol: sym,
        price: stockResults[idx] ?? null,
      }));

      socket.emit("dashboardUpdate", {
        bitcoin,
        nifty,
        stocks,
      });

    } catch (err) {
      console.error("Live update error:", err.message);
      socket.emit("dashboardError", { message: "Update failed" });
    }
  }, 4000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
