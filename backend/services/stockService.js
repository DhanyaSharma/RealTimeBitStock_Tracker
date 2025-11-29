
const axios = require("axios");

async function getNSEStocks(symbols) {
  try {
    
    const requests = symbols.map((sym) =>
      axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1m`
      )
    );

    const responses = await Promise.allSettled(requests);

    const results = responses.map((res, idx) => {
      const symbol = symbols[idx].replace(".NS", "");

      if (res.status === "rejected") {
        console.error(`Yahoo Error for ${symbol}:`, res.reason.message);
        return { symbol, price: null };
      }

      const meta = res.value.data?.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice ?? null;

      return { symbol, price };
    });

    console.log("📌 Stocks fetched:", results);
    return results;
  } catch (err) {
    console.error("Stock fetch fatal error:", err.message);

    return symbols.map((s) => ({
      symbol: s.replace(".NS", ""),
      price: null,
    }));
  }
}

module.exports = { getNSEStocks };
