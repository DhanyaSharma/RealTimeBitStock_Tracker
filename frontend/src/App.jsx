import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { defaultStocks } from "./nseList";
import { nseSymbols } from "./nseSymbols"; // your 500 list for autocomplete

const socket = io("http://localhost:5000");

function formatINR(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export default function App() {
  const [bitcoin, setBitcoin] = useState(null);
  const [nifty, setNifty] = useState(null);
  const [stocks, setStocks] = useState([]); // array of {symbol, price}

  // search/autocomplete (same as before)
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    socket.on("dashboardUpdate", (data) => {
      setBitcoin(data.bitcoin);
      setNifty(data.nifty);
      setStocks(data.stocks || []);
    });

    socket.on("dashboardError", (e) => {
      console.warn("Dashboard error:", e);
    });

    return () => {
      socket.off("dashboardUpdate");
      socket.off("dashboardError");
    };
  }, []);

  // autocomplete from your big symbol list
  const onInput = (v) => {
    const s = v.toUpperCase();
    setQuery(s);
    if (!s || s.length < 1) {
      setSuggestions([]);
      return;
    }
    const filtered = nseSymbols.filter((sym) => sym.startsWith(s));
    setSuggestions(filtered.slice(0, 8));
  };

  // add symbol to the visible queue (frontend only) — optional
  const addSymbolToQueue = (sym) => {
    // prevent duplicates
    if (stocks.find((s) => s.symbol === sym)) return;
    // show a placeholder immediately; backend will update next tick if it is in server list
    setStocks((prev) => [{ symbol: sym, price: null }, ...prev].slice(0, 50));
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>Real-Time Price Tracker</h1>
      </header>

      <main className="main">
        <div className="search-wrap">
          <div className="search-input-wrap">
            <input
              className="search-input"
              placeholder="Enter NSE stock symbol..."
              value={query}
              onChange={(e) => onInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query) addSymbolToQueue(query.toUpperCase());
              }}
            />
            <button
              className="search-btn"
              onClick={() => query && addSymbolToQueue(query.toUpperCase())}
            >
              Add
            </button>

            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((s) => (
                  <div
                    className="suggestion-item"
                    key={s}
                    onClick={() => addSymbolToQueue(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pinned top: Bitcoin and NIFTY */}
        <section className="cards">
          <article className="card pinned">
            <div className="card-head">
              <div>
                <div className="card-title">Bitcoin Price</div>
                <div className="card-sub">BTC → INR</div>
              </div>
              <div className="live-indicator">
                <span className="live-dot" />
                <span className="live-text">Updating live...</span>
              </div>
            </div>
            <div className="card-body">
              <div className="price">₹ {formatINR(bitcoin)}</div>
            </div>
          </article>

          <article className="card pinned">
            <div className="card-head">
              <div>
                <div className="card-title">NIFTY 50</div>
                <div className="card-sub">Index: NIFTY 50</div>
              </div>
              <div className="live-indicator">
                <span className="live-dot" />
                <span className="live-text">Updating live...</span>
              </div>
            </div>
            <div className="card-body">
              <div className="price">₹ {formatINR(nifty)}</div>
            </div>
          </article>

          {/* Now show the grid of the STOCK_LIST (15) */}
          <div className="grid-cards">
            {stocks.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: 24 }}>
                Loading stocks...
              </div>
            )}

            {stocks.map((s) => (
              <article className="card" key={s.symbol}>
                <div className="card-head">
                  <div>
                    <div className="card-title">{s.symbol} Price</div>
                    <div className="card-sub">NSE: {s.symbol}</div>
                  </div>
                  <div className="live-indicator">
                    <span className="live-dot" />
                    <span className="live-text">Updating live...</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="price">₹ {formatINR(s.price)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
