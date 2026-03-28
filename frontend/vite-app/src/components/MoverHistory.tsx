import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import type { StockMover } from "@/lib/api";

interface MoverHistoryProps {
  data: StockMover[];
}

export function MoverHistory({ data }: MoverHistoryProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Ticker</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Open</TableHead>
            <TableHead className="text-right">Close</TableHead>
            <TableHead className="text-right">% Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((mover, i) => {
            const isGain = mover.percentChange > 0;
            return (
              <motion.tr
                key={mover.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <TableCell className="font-medium">{mover.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {mover.ticker}
                  </Badge>
                </TableCell>
                <TableCell>{mover.company}</TableCell>
                <TableCell className="text-right font-mono">
                  ${mover.open.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${mover.close.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 font-mono font-semibold ${
                      isGain ? "text-gain" : "text-loss"
                    }`}
                  >
                    {isGain ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {isGain ? "+" : ""}
                    {mover.percentChange.toFixed(2)}%
                  </span>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
