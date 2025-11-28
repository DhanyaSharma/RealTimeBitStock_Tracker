const axios = require("axios");

async function getNifty() {
  try {
   
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
