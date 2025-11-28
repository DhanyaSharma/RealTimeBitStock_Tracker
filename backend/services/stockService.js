const axios = require("axios");

async function getIndianStock(symbol) {
  try {
    const yahooSymbol = `${symbol}.NS`; // NSE symbol pattern
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1m`;

    const res = await axios.get(url);

    const result = res.data?.chart?.result?.[0];
    const price = result?.meta?.regularMarketPrice;

    return price ? Number(price) : null;
  } catch (err) {
    console.error("Stock price error:", err.message);
    return null;
  }
}

module.exports = { getIndianStock };
