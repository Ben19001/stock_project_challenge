import { useState, useEffect } from "react";
import { fetchTopMovers, type StockMover } from "@/lib/api"; 
import { TopMoverCard } from "@/components/TopMoverCard";
import { MoverHistory } from "@/components/MoverHistory";
import { MoverChart } from "@/components/MoverChart";
import { TickerBreakdown } from "@/components/TickerBreakdown";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export default function Index() {
  const [movers, setMovers] = useState<StockMover[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Use the beautiful helper function you built in api.ts!
        // This automatically fetches and correctly maps the data.
        const data = await fetchTopMovers();
        setMovers(data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Check your AWS endpoint and console network tab.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const latest = movers[0];

  return (
    <div className="min-h-screen bg-background ml-12 mr-12">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Stock Watchlist Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Daily top mover from the TRE Team watchlist
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"].map((t) => (
              <Badge key={t} variant="outline" className="font-mono text-xs">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Loading and Error States */}
        {isLoading && (
          <p className="text-center text-muted-foreground animate-pulse">
            Fetching live data from AWS...
          </p>
        )}
        {error && (
          <p className="text-center text-destructive font-semibold">
            {error}
          </p>
        )}

        {/* Dashboard Content */}
        {!isLoading && !error && movers.length > 0 && (
          <>
            <TopMoverCard mover={latest} />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <MoverChart data={movers} />
              </div>
              <TickerBreakdown data={movers} />
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold tracking-tight">
                Mover History
              </h2>
              <MoverHistory data={movers} />
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && movers.length === 0 && (
          <p className="text-center text-muted-foreground">
            No data found in your DynamoDB table yet.
          </p>
        )}
      </main>
    </div>
  );
}