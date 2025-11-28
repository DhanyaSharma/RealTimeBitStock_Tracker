const axios = require("axios");


let cachedBTC = null;
let lastBTCFetch = 0;

async function getBTCinINR() {
  try {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr";

    const res = await axios.get(url);

    const price = res.data?.bitcoin?.inr;

    if (!price) throw new Error("BTC price missing");

    return Number(price);
  } catch (err) {
    console.error("BTC error:", err.message);
    return null;
  }
}

module.exports = { getBTCinINR };



let cachedNifty = null;
let lastNiftyFetch = 0;

async function getNiftyPrice() {
  const now = Date.now();

  if (cachedNifty && now - lastNiftyFetch < 3000) {
    return cachedNifty;
  }

  try {
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1m";
    const res = await axios.get(url);

    const result = res.data?.chart?.result?.[0];
    const price = result?.meta?.regularMarketPrice;

    if (price) {
      cachedNifty = Number(price);
      lastNiftyFetch = now;
      return cachedNifty;
    }

    throw new Error("NIFTY price missing");
  } catch (err) {
    console.error("NIFTY error:", err.message);
    return cachedNifty || null;
  }
}


let cachedStocks = {};
let lastStockFetch = 0;

async function getNSEStocks(symbols) {
  const now = Date.now();

  if (Object.keys(cachedStocks).length > 0 && now - lastStockFetch < 3000) {
    return symbols.map((sym) => cachedStocks[sym] || { symbol: sym, price: null });
  }

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(
      ","
    )}`;
    const res = await axios.get(url);

    const results = res.data.quoteResponse.result;

    const formatted = results.map((s) => ({
      symbol: s.symbol.replace(".NS", ""),
      price: s.regularMarketPrice ?? null,
    }));

    formatted.forEach(
      (obj) => (cachedStocks[obj.symbol + ".NS"] = obj)
    );
    lastStockFetch = now;

    return formatted;
  } catch (err) {
    console.error("Stocks error:", err.message);

    return symbols.map((sym) => cachedStocks[sym] || { symbol: sym, price: null });
  }
}


module.exports = {
  getBTCinINR,
  getNiftyPrice,
  getNSEStocks,
};
