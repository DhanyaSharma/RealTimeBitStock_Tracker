import axios from "axios";

export async function getBitcoinINR() {
  try {
    
    const btcRes = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const btcUSDT = parseFloat(btcRes.data.price);

    
    const forexRes = await axios.get("https://open.er-api.com/v6/latest/USD");
    const usdToInr = forexRes.data.rates.INR;

    if (!btcUSDT || !usdToInr) {
      console.log("BTC → INR conversion missing");
      return null;
    }

    const btcINR = btcUSDT * usdToInr;
    return btcINR;
  } catch (err) {
    console.error("BTC Fetch Error:", err.message);
    return null;
  }
}

export async function getNifty50() {
  try {
    const res = await axios.get(
      "https://latest-stock-price.p.rapidapi.com/any?Indices=NIFTY%2050",
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "latest-stock-price.p.rapidapi.com",
        },
      }
    );

    if (!res.data || !res.data[0] || !res.data[0].lastPrice) {
      return null;
    }

    return res.data[0].lastPrice;
  } catch (err) {
    console.error("Nifty fetch error:", err.message);
    return null;
  }
}

export async function getStockPrice(symbol) {
  try {
    const res = await axios.get(
      `https://latest-stock-price.p.rapidapi.com/any?Symbol=${symbol}`,
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "latest-stock-price.p.rapidapi.com",
        },
      }
    );

    if (!res.data || !res.data[0]) return null;
    return res.data[0].lastPrice;
  } catch (err) {
    console.error(`Stock Fetch Error (${symbol}):`, err.message);
    return null;
  }
}
