"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Panel } from "@/components/ui/Panel";
import { TrendChart } from "@/components/charts/TrendChart";
import { cn } from "@/lib/utils/cn";
import type { MilkTrendPoint } from "@/types/dashboard";

export function MilkTrendChart({ data, days }: { data: MilkTrendPoint[]; days: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(range: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", String(range));
    return `${pathname}?${params.toString()}`;
  }

  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Milk Trend</h2>
        <div className="flex gap-1 text-xs">
          {[7, 30].map((range) => (
            <Link
              key={range}
              href={hrefFor(range)}
              className={cn(
                "rounded-md px-2 py-1 font-medium",
                days === range
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-hover)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]",
              )}
            >
              {range} Days
            </Link>
          ))}
        </div>
      </div>

      <TrendChart
        data={data.map((point) => ({ date: point.date, value: point.total }))}
        unitSuffix=" L"
        tooltipLabel="Total milk"
      />
    </Panel>
  );
}
