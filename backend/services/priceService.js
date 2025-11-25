const axios = require("axios");

/**
 * Get USD→INR using Yahoo Finance (always works)
 */
async function getUsdInr() {
  try {
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X?interval=1m";
    const res = await axios.get(url);

    const result = res.data?.chart?.result?.[0];
    const price = result?.meta?.regularMarketPrice;

    return price ? Number(price) : null;
  } catch (err) {
    console.error("FX error:", err.message);
    return 83.0; // fallback if Yahoo blocks
  }
}

/**
 * Get BTC price in INR: Binance BTCUSDT * USDINR
 */
async function getBTCinINR() {
  try {
    // Step 1: BTC price in USDT
    const btcRes = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const btcUsd = parseFloat(btcRes.data.price);

    // Step 2: USD → INR
    const usdInr = await getUsdInr();
    if (!usdInr) throw new Error("Failed to fetch USD/INR");

    return Number(btcUsd * usdInr);
  } catch (err) {
    console.error("Crypto price error:", err.message);
    return null;
  }
}

module.exports = { getBTCinINR };
