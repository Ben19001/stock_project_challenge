import 'dotenv/config';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_TABLE;
const apiKey = process.env.FINNHUB_API_KEY;

export const ingest = async (event) => {
    const watchlist = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];

    let topMover = null;
    let maxAbsChange = -1;
    const today = new Date().toISOString().split('T')[0];

    for (const ticker of watchlist) {
        try {
            // Use native fetch instead of the clunky Finnhub SDK!
            const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error(`API Error for ${ticker}: ${response.status}`);
                continue;
            }

            const data = await response.json();
            
            // Finnhub returns 'o' for open and 'c' for close
            const openPrice = data.o;
            const closePrice = data.c;

            // Prevent division by zero if the market data is weird
            if (openPrice === 0 || openPrice === null) {
                console.log(`Skipping ${ticker} - No open price available.`);
                continue;
            }

            const percentChange = ((closePrice - openPrice) / openPrice) * 100;
            const absoluteChange = Math.abs(percentChange);

            console.log(`Ticker: ${ticker}, Open: ${openPrice}, Close: ${closePrice}, Change: ${percentChange.toFixed(2)}%`);

            if (absoluteChange > maxAbsChange) {
                maxAbsChange = absoluteChange;
                topMover = {
                    date: today,
                    ticker: ticker,
                    percentChange: percentChange,
                    closePrice: closePrice
                };
            }
        } catch (error) {
            console.error(`Failed to fetch data for ${ticker}:`, error);
        }
    }

    if (topMover) {
        await dynamo.send(new PutCommand({
            TableName: tableName,
            Item: {
                category: "WINNER",
                date: topMover.date,
                ticker: topMover.ticker,
                percentChange: topMover.percentChange,
                closePrice: topMover.closePrice
            }
        }));
        console.log("Saved top mover:", topMover);
    }
};

export const get_movers = async (event) => {
    try {
        const result = await dynamo.send(new ScanCommand({
            TableName: tableName,
            Limit: 7
        }));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result.Items)
        };
    } catch (error) {
        console.error("Database error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to retrieve movers" })
        };
    }
};