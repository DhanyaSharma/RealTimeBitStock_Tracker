const axios = require("axios");

async function getIndianStocks(symbols) {
  try {
    const yahooSymbols = symbols.map(s => `${s}.NS`).join(",");

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}`;

    const res = await axios.get(url);

    return res.data.quoteResponse.result.map(s => ({
      symbol: s.symbol.replace(".NS", ""),
      price: s.regularMarketPrice ?? null,
    }));
  } catch (err) {
    console.error("Stocks error:", err.message);
    return symbols.map(s => ({ symbol: s, price: null }));
  }
}

module.exports = { getIndianStocks };
