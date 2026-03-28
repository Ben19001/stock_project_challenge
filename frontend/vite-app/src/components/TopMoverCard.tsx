import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import type { StockMover } from "@/lib/api";

interface TopMoverCardProps {
  mover: StockMover;
}

export function TopMoverCard({ mover }: TopMoverCardProps) {
  const isGain = mover.percentChange > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Top Mover
            </CardTitle>
            <Badge
              className={
                isGain
                  ? "bg-gain text-gain-foreground hover:bg-gain/90"
                  : "bg-loss text-loss-foreground hover:bg-loss/90"
              }
            >
              {isGain ? "Gain" : "Loss"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold tracking-tight">{mover.ticker}</p>
              <p className="text-sm text-muted-foreground">{mover.company}</p>
              <p className="mt-1 text-xs text-muted-foreground">{mover.date}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {isGain ? (
                  <TrendingUp className="h-5 w-5 text-gain" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-loss" />
                )}
                <span
                  className={`text-2xl font-bold ${isGain ? "text-gain" : "text-loss"}`}
                >
                  {isGain ? "+" : ""}
                  {mover.percentChange.toFixed(2)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                ${mover.open.toFixed(2)} → ${mover.close.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
