const axios = require("axios");

/**
 * Fetch NSE stock prices using Yahoo CHART API
 * Much more stable than the quote API.
 */
async function getNSEStocks(symbols) {
  try {
    const result = [];

    for (const sym of symbols) {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1m`;

      const res = await axios.get(url);

      const meta = res.data?.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice;

      result.push({
        symbol: sym.replace(".NS", ""),
        price: price ?? null,
      });
    }

    console.log("📌 Stocks fetched:", result);
    return result;

  } catch (err) {
    console.error("Stocks error:", err.message);
    return symbols.map(sym => ({
      symbol: sym.replace(".NS", ""),
      price: null,
    }));
  }
}

module.exports = { getNSEStocks };
