"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatShortDate(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

/**
 * A minimal Recharts line chart for a single day-indexed series. Has no
 * built-in range toggle — callers that need one (see
 * dashboard/MilkTrendChart) wrap this and control the data passed in.
 */
export function TrendChart({
  data,
  unitSuffix,
  tooltipLabel,
}: {
  data: { date: string; value: number }[];
  unitSuffix: string;
  tooltipLabel: string;
}) {
  const chartData = data.map((point) => ({ label: formatShortDate(point.date), value: point.value }));
  const sparse = data.length > 10;

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="var(--color-text-faint)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval={sparse ? 4 : 0}
          />
          <YAxis stroke="var(--color-text-faint)" fontSize={11} tickLine={false} axisLine={false} width={36} />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(2)}${unitSuffix}`, tooltipLabel]}
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
