// 🚨 Replace this base URL with your actual API Gateway endpoint
export const API_BASE_URL = "https://pcvhz3qys1.execute-api.us-east-1.amazonaws.com/movers";

export interface StockMover {
  date: string;
  ticker: string;
  company: string;
  open: number;
  close: number;
  percentChange: number;
}

// Company name mapping for display
export const TICKER_NAMES: Record<string, string> = {
  AAPL: "Apple",
  MSFT: "Microsoft",
  GOOGL: "Alphabet",
  AMZN: "Amazon",
  TSLA: "Tesla",
  NVDA: "NVIDIA",
};

export async function fetchTopMovers(): Promise<StockMover[]> {
  const response = await fetch(API_BASE_URL);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data: ${response.status}`);
  }
  
  const data = await response.json();

  // Map the DynamoDB data to exactly match the StockMover interface
  return data.map((item: any) => {
    const close = item.closePrice || 0;
    const percentChange = item.percentChange || 0;
    
    // We didn't save 'open' in the database, but we can reverse-engineer it!
    // Formula: open = close / (1 + (percentChange / 100))
    const open = percentChange !== 0 
      ? close / (1 + (percentChange / 100)) 
      : close;

    return {
      date: item.date,
      ticker: item.ticker,
      company: TICKER_NAMES[item.ticker] || item.ticker, // Add the company name
      open: open,
      close: close,
      percentChange: percentChange
    };
  });
}

// Mock data for development/demo purposes
export const MOCK_DATA: StockMover[] = [
  { date: "2026-03-27", ticker: "TSLA", company: "Tesla", open: 178.50, close: 185.20, percentChange: 3.75 },
  { date: "2026-03-26", ticker: "NVDA", company: "NVIDIA", open: 890.00, close: 865.30, percentChange: -2.78 },
  { date: "2026-03-25", ticker: "AAPL", company: "Apple", open: 172.00, close: 175.80, percentChange: 2.21 },
  { date: "2026-03-24", ticker: "AMZN", company: "Amazon", open: 182.50, close: 178.10, percentChange: -2.41 },
  { date: "2026-03-21", ticker: "GOOGL", company: "Alphabet", open: 155.20, close: 160.10, percentChange: 3.16 },
  { date: "2026-03-20", ticker: "MSFT", company: "Microsoft", open: 415.00, close: 421.50, percentChange: 1.57 },
  { date: "2026-03-19", ticker: "TSLA", company: "Tesla", open: 180.00, close: 172.40, percentChange: -4.22 },
  { date: "2026-03-18", ticker: "NVDA", company: "NVIDIA", open: 870.00, close: 895.50, percentChange: 2.93 },
  { date: "2026-03-17", ticker: "AAPL", company: "Apple", open: 174.50, close: 171.20, percentChange: -1.89 },
  { date: "2026-03-14", ticker: "AMZN", company: "Amazon", open: 179.00, close: 184.60, percentChange: 3.13 },
  { date: "2026-03-13", ticker: "GOOGL", company: "Alphabet", open: 158.00, close: 153.50, percentChange: -2.85 },
  { date: "2026-03-12", ticker: "MSFT", company: "Microsoft", open: 410.00, close: 418.70, percentChange: 2.12 },
];