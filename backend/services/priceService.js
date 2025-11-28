const axios = require("axios");

/* ---------------- USD → INR ---------------- */
async function getUsdInr() {
  try {
    const url = "https://api.exchangerate.host/latest?base=USD&symbols=INR";
    const res = await axios.get(url);
    return res.data.rates.INR;
  } catch {
    return 83;
  }
}

/* ---------------- BTC ---------------- */
async function getBTCinINR() {
  try {
    // CoinGecko — NO API KEY, NO RATE LIMIT
    const cg = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr"
    );
    return cg.data.bitcoin.inr;
  } catch (err) {
    console.error("CoinGecko BTC error:", err.message);
    return null;
  }
}

/* ---------------- NIFTY ---------------- */
async function getNiftyPrice() {
  try {
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1m";

    const res = await axios.get(url);
    const result = res.data.chart.result[0];
    return result.meta.regularMarketPrice;
  } catch (err) {
    console.error("NIFTY error:", err.message);
    return null;
  }
}

module.exports = { getBTCinINR, getNiftyPrice };
