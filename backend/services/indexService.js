const axios = require("axios");

/**
 * Get NIFTY price using Yahoo Finance (very stable).
 */
async function getNifty() {
  try {
    // ^NSEI = NIFTY 50 ticker
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1m";

    const res = await axios.get(url);

    const result = res.data?.chart?.result?.[0];
    const last = result?.meta?.regularMarketPrice;

    return last ? Number(last) : null;
  } catch (err) {
    console.error("Nifty fetch error:", err.message);
    return null;
  }
}

module.exports = { getNifty };
