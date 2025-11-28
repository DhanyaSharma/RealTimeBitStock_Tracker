const axios = require("axios");

// USD → INR
async function getUsdInr() {
  try {
    const url = "https://api.exchangerate.host/latest?base=USD&symbols=INR";
    const res = await axios.get(url);
    return res.data?.rates?.INR || 83;
  } catch {
    return 83;
  }
}

// BTC in INR (Binance + USDINR)
async function getBTCinINR() {
  try {
    const btcRes = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );

    const btcUsd = parseFloat(btcRes.data.price);
    const usdInr = await getUsdInr();

    return Number(btcUsd * usdInr);
  } catch (err) {
    console.error("BTC error:", err.message);
    return null;
  }
}

async function getNiftyPrice() {
  try {
    const res = await axios.get(
      "https://api.twelvedata.com/price?symbol=NSEI"
    );
    return Number(res.data.price);
  } catch (err) {
    console.error("NIFTY error:", err.message);
    return null;
  }
}

module.exports = { getBTCinINR, getNiftyPrice };
