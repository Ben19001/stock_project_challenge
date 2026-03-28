import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockMover } from "@/lib/api";

interface TickerBreakdownProps {
  data: StockMover[];
}

const COLORS = [
  "hsl(220, 70%, 50%)",
  "hsl(152, 60%, 40%)",
  "hsl(35, 90%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(280, 60%, 55%)",
  "hsl(190, 70%, 45%)",
];

export function TickerBreakdown({ data }: TickerBreakdownProps) {
  const counts: Record<string, number> = {};
  data.forEach((d) => {
    counts[d.ticker] = (counts[d.ticker] || 0) + 1;
  });

  const pieData = Object.entries(counts)
    .map(([ticker, count]) => ({ ticker, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Top Mover Frequency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="count"
              nameKey="ticker"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ ticker, count }) => `${ticker} (${count})`}
              labelLine={false}
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-card p-2 shadow-md">
                    <p className="text-sm font-semibold">{d.ticker}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.count} time{d.count > 1 ? "s" : ""}
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
