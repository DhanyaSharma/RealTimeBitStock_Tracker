const axios = require("axios");

/**
 * ✅ Get USD → INR (Yahoo Finance)
 */
async function getUsdInr() {
  try {
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X?interval=1m";

    const res = await axios.get(url);
    const result = res.data?.chart?.result?.[0];
    return Number(result?.meta?.regularMarketPrice) || 83;
  } catch {
    return 83; // fallback
  }
}

/**
 * ✅ BTC in INR = Binance BTCUSDT × USDINR
 */
async function getBTCinINR() {
  try {
    const btc = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const usd = Number(btc.data.price);

    const usdInr = await getUsdInr();

    return Number(usd * usdInr);
  } catch (err) {
    console.error("BTC Price Error:", err.message);
    return null;
  }
}

module.exports = { getBTCinINR };
