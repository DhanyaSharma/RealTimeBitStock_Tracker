const axios = require("axios");

/**
 * ✅ Get USD → INR using Yahoo Finance
 */
async function getUsdInr() {
  try {
    const url =
      "https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X?interval=1m";

    const res = await axios.get(url);
    const result = res.data?.chart?.result?.[0];
    const price = result?.meta?.regularMarketPrice;

    return price ? Number(price) : null;
  } catch (err) {
    console.error("FX error:", err.message);
    return 83; // safe fallback
  }
}

/**
 * ✅ BTC price in INR → Binance BTCUSDT * USDINR
 */
async function getBTCinINR() {
  try {
    const btcRes = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const btcUsd = parseFloat(btcRes.data.price);

    const usdInr = await getUsdInr();
    if (!usdInr) throw new Error("Failed USD/INR");

    return Number(btcUsd * usdInr);
  } catch (err) {
    console.error("BTC error:", err.message);
    return null;
  }
}

/**
 * ✅ Get NIFTY price from NSE India
 */
async function getNiftyPrice() {
  try {
    const res = await axios.get(
      "https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1m"
    );

    const result = res.data?.chart?.result?.[0];
    const price = result?.meta?.regularMarketPrice;

    return price ? Number(price) : null;
  } catch (err) {
    console.error("NIFTY error:", err.message);
    return null;
  }
}

/**
 * ✅ Get multiple NSE stock prices (Yahoo Finance)
 * symbols = ["INFY.NS", "TCS.NS", "HDFCBANK.NS"]
 */
async function getNSEStocks(symbols) {
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(
      ","
    )}`;

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

module.exports = {
  getBTCinINR,
  getNiftyPrice,
  getNSEStocks,
};
