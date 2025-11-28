
const axios = require("axios");
let cachedBTC = null;
let lastFetch = 0;
let lastProvider = null;

async function fetchWazirx() {
  const res = await axios.get("https://api.wazirx.com/api/v2/tickers/btcinr", { timeout: 5000 });
  return Number(res.data?.ticker?.last);
}

async function fetchCoinStats() {
  const res = await axios.get("https://api.coinstats.app/public/v1/coins/bitcoin?currency=INR", { timeout: 5000 });
  return Number(res.data?.coin?.price);
}

async function fetchBinanceUsdInr() {
  
  const btcRes = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", { timeout: 5000 });
  const usd = Number(btcRes.data?.price);
  if (!usd) throw new Error("Binance missing price");

  const fxRes = await axios.get("https://api.exchangerate.host/latest?base=USD&symbols=INR", { timeout: 5000 });
  const inr = Number(fxRes.data?.rates?.INR);
  if (!inr) throw new Error("FX missing");

  return Number(usd * inr);
}

async function getBTCinINR() {
  const now = Date.now();

  
  if (cachedBTC && now - lastFetch < 3000) {
    return cachedBTC;
  }

  const providers = [
    { name: "WazirX", fn: fetchWazirx },
    { name: "CoinStats", fn: fetchCoinStats },
    { name: "Binance+FX", fn: fetchBinanceUsdInr },
  ];

  for (const p of providers) {
    try {
      const v = await p.fn();
      if (v && !Number.isNaN(v)) {
        cachedBTC = Number(v);
        lastFetch = now;
        lastProvider = p.name;
        console.log(`BTC fetched from ${p.name}: ${cachedBTC}`);
        return cachedBTC;
      }
    } catch (err) {
      
      console.warn(`BTC provider ${p.name} failed:`, err.message || err);
    }
  }
  console.error("All BTC providers failed. Returning cached value (if any). Last provider:", lastProvider);
  return cachedBTC || null;
}

module.exports = { getBTCinINR };
