const axios = require("axios");

// Cache to avoid hitting CoinGecko rate limit
let cachedBTC = null;
let lastFetch = 0;

/**
 * Fetch Bitcoin price in INR using CoinGecko
 * Reliable for deployed servers (Render, Vercel, Railway)
 */
async function getBTCinINR() {
  const now = Date.now();

  // ✅ If fetched within last 3 seconds → return cached price
  if (cachedBTC && now - lastFetch < 3000) {
    return cachedBTC;
  }

  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr"
    );

    const price = res.data?.bitcoin?.inr;

    if (!price) throw new Error("INR price missing");

    cachedBTC = Number(price);
    lastFetch = now;

    return cachedBTC;
  } catch (err) {
    console.error("CoinGecko BTC fetch failed:", err.message);

    // ✅ If API fails, return last valid cached value instead of null
    return cachedBTC || null;
  }
}

module.exports = { getBTCinINR };

// const axios = require("axios");

// /**
//  * Get USD→INR using Yahoo Finance (always works)
//  */
// async function getUsdInr() {
//   try {
//     const url = "https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X?interval=1m";
//     const res = await axios.get(url);

//     const result = res.data?.chart?.result?.[0];
//     const price = result?.meta?.regularMarketPrice;

//     return price ? Number(price) : null;
//   } catch (err) {
//     console.error("FX error:", err.message);
//     return 83.0; // fallback if Yahoo blocks
//   }
// }

// /**
//  * Get BTC price in INR: Binance BTCUSDT * USDINR
//  */
// async function getBTCinINR() {
//   try {
//     // Step 1: BTC price in USDT
//     const btcRes = await axios.get(
//       "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
//     );
//     const btcUsd = parseFloat(btcRes.data.price);

//     // Step 2: USD → INR
//     const usdInr = await getUsdInr();
//     if (!usdInr) throw new Error("Failed to fetch USD/INR");

//     return Number(btcUsd * usdInr);
//   } catch (err) {
//     console.error("Crypto price error:", err.message);
//     return null;
//   }
// }

// module.exports = { getBTCinINR };
