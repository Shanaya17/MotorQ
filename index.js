require("dotenv").config();
const express = require("express");
const axios = require("axios");
const Airtable = require("airtable");
const cron = require("node-cron");

const app = express();
app.use(express.json());

Airtable.configure({ apiKey: process.env.AIRTABLE_TOKEN_KEY });
const base = Airtable.base(process.env.BASE_ID);

const coinIds = {};
const coinPriceCache = {};

const updateCoinPriceCache = async () => {
    try {
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/simple/price",
            {
                params: {
                    ids: Object.keys(coinIds).join(","),
                    vs_currency: "usd",
                },
            }
        );
        const price = response.data;
        Object.keys(price).forEach((coinID) => {
            coinPriceCache[coinID] = price[coinID].usd;
        });
    } catch (error) {
        console.error("error updating cache ->", error);
    }
};

const updateCoinDetails = async () => {
    try {
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets",
            {
                params: {
                    vs_currency: "usd",
                    order: "market_cap_desc",
                    per_page: 20,
                    page: 1,
                },
            }
        );

        response.data.forEach(async (coin) => {
            if (!coinIds[coin.id]) {
                base("Coins").create(
                    [
                        {
                            fields: {
                                name: coin.name,
                                symbol: coin.symbol,
                                current_price: coinPriceCache[coin.id] || coin.current_price,
                                market_cap: coin.market_cap,
                            },
                        },
                    ],
                    function (err, records) {
                        if (err) {
                            console.error("Error creating records:", err);
                        } else {
                            console.log("Records created successfully!");
                        }
                    }
                );
            }
        });
    } catch (error) {
        console.error("error updating coin details ->", error);
    }
};

// Set cron jobs
cron.schedule("*/10 * * * *", async () => {
    try {
        console.log("successfully fetch top 20 entries");
        await updateCoinDetails();
    } catch (err) {
        console.log("error->", err);
    }
});

cron.schedule("*/1 * * * *", async () => {
    try {
        console.log("update the price");
        await updateCoinPriceCache();
    } catch (err) {
        console.log("error ->", err);
    }
});

app.get("/coins", async (req, res) => {
    try {
        console.log("/get/coins");
        const mydata = {};

        await base("Coins")
            .select({
                maxRecords: 20,
                view: "Grid view",
            })
            .eachPage(
                function page(records, nxtpage) {
                    records.forEach(function (record) {
                        mydata[record.get("symbol")] = {
                            price: coinPriceCache[record.id] || record.get("current_price"),
                        };
                    });
                    nxtpage();
                },
                function done(err) {
                    if (err) {
                        console.error("error-> ", err);
                        res.status(500).json({ error: "Internal server error" });
                    } else {
                        res.json(mydata);
                    }
                }
            );
    } catch (err) {
        console.log("error-> ", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/coins/price/:coinId", async (req, res) => {
    try {
        const coinId = req.params.coinId;
        console.log(`/coins/price/${coinId}`);
        const records = await base("Coins")
            .select({
                maxRecords: 1,
                filterByFormula: `{symbol}="${coinId}"`,
            })
            .firstPage();

        if (records.length === 1) {
            const coinPrice = coinPriceCache[records[0].id] || records[0].get("current_price");
            res.json({ coinId, price: coinPrice });
        } else {
            res.status(404).json({ error: "Coin not found" });
        }
    } catch (err) {
        console.log("error->", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// airtablr ka data
app.get("/airtable-data", async (req, res) => {
    try {
        console.log("/airtable-data");
        const airtableData = await base("YourAirtableTableName") // naam badal dena table wala
            .select({
                maxRecords: 20,
                view: "Grid view", // view dekh lena
            })
            .all();
        res.json(airtableData);
    } catch (err) {
        console.log("error->", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
});