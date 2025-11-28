const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Correct imports
const { getBTCinINR, getNiftyPrice, getNSEStocks } = require("./services/priceService");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// --- 15 Stocks ---
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
      const nifty = await getNiftyPrice();

      // Yahoo expects .NS suffix
      const yahooSymbols = STOCK_LIST.map(sym => sym + ".NS");

      const stocks = await getNSEStocks(yahooSymbols);

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
    console.log("Client disconnected:", socket.id);
    clearInterval(interval);
  });
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server on", PORT));
