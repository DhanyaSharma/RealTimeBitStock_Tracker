const axios = require("axios");

async function getNSEStocks(symbols) {
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(",")}`;

    const res = await axios.get(url);
    return res.data.quoteResponse.result.map((s) => ({
      symbol: s.symbol.replace(".NS", ""),
      price: s.regularMarketPrice ?? null,
    }));
  } catch (err) {
    console.error("Stocks error:", err.message);
    return [];
  }
}

module.exports = { getNSEStocks };
