import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockMover } from "@/lib/api";

interface MoverChartProps {
  data: StockMover[];
}

export function MoverChart({ data }: MoverChartProps) {
  const chartData = [...data].reverse().map((d) => ({
    date: d.date.slice(5), // MM-DD
    ticker: d.ticker,
    percentChange: d.percentChange,
    label: `${d.ticker} ${d.percentChange > 0 ? "+" : ""}${d.percentChange.toFixed(2)}%`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Daily Top Mover — % Change
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(v) => `${Number(v).toFixed(2)}%`}
              domain={[
                (dataMin) => Math.min(0, dataMin), 
                (dataMax) => Math.max(0, dataMax)  
              ]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const isGain = d.percentChange > 0;
                return (
                  <div className="rounded-lg border bg-card p-3 shadow-md">
                    <p className="text-sm font-semibold">{d.ticker}</p>
                    <p className="text-xs text-muted-foreground">{d.date}</p>
                    <p
                      className={`mt-1 text-sm font-bold ${
                        isGain ? "text-gain" : "text-loss"
                      }`}
                    >
                      {isGain ? "+" : ""}
                      {d.percentChange.toFixed(2)}%
                    </p>
                  </div>
                );
              }}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.4} />
            <Bar dataKey="percentChange" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.percentChange > 0
                      ? "hsl(152, 60%, 40%)"
                      : "hsl(0, 72%, 51%)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
