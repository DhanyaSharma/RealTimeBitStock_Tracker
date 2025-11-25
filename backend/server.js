const { getIndianStocks } = require("./services/stockService");

const interval = setInterval(async () => {
  try {
    const bitcoin = await getBTCinINR();
    const nifty = await getNifty();
    const stocks = await getIndianStocks(STOCK_LIST);

    socket.emit("dashboardUpdate", {
      bitcoin,
      nifty,
      stocks,
    });
  } catch (err) {
    console.error("Live update error:", err.message);
    socket.emit("dashboardError", { message: "Update failed" });
  }
}, 5000);
