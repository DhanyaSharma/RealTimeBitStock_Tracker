const express = require("express");
const router = express.Router();
const { getPrice } = require("../services/priceService");

router.get("/:coin", async (req, res) => {
    const coin = req.params.coin;
    const price = await getPrice(coin);

    if (price === null) {
        return res.status(500).json({ error: "Unable to fetch price" });
    }

    res.json({ coin, price });
});

module.exports = router;
