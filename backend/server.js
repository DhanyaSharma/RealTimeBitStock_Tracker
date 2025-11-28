const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const { getBTCinINR, getNiftyPrice } = require("./services/priceService");
const { getNSEStocks } = require("./services/stockService");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

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

      const symbols = STOCK_LIST.map((s) => s + ".NS");
      const stocks = await getNSEStocks(symbols);

      socket.emit("dashboardUpdate", { bitcoin, nifty, stocks });
    } catch (err) {
      socket.emit("dashboardError", { message: "Update failed" });
    }
  }, 5000);

  socket.on("disconnect", () => clearInterval(interval));
});

app.get("/", (req, res) => {
  res.send("Backend running successfully ✔");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Running on", PORT));
