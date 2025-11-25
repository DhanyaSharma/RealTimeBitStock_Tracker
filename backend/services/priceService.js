const axios = require("axios");

/**
 * ✅ Bitcoin price in INR from CoinGecko
 */
async function getBTCinINR() {
  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr"
    );

    return res.data.bitcoin.inr ?? null;
  } catch (err) {
    console.error("BTC error:", err.message);
    return null;
  }
}

module.exports = { getBTCinINR };
