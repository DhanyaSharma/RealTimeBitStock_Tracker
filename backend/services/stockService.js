const axios = require("axios");

async function getNSEStocks(symbols) {
  try {
    const results = await Promise.all(
      symbols.map(async (sym) => {
        try {
          const res = await axios.get(
            `https://api.twelvedata.com/price?symbol=${sym}`
          );

          return {
            symbol: sym.replace(".NS", ""),
            price: res.data.price ? Number(res.data.price) : null,
          };
        } catch {
          return { symbol: sym.replace(".NS", ""), price: null };
        }
      })
    );

    return results;
  } catch (err) {
    console.error("Stocks error:", err.message);
    return [];
  }
}

module.exports = { getNSEStocks };
