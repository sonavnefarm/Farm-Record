"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import type { DateRangePreset } from "@/lib/utils/date-ranges";

const PRESET_LABELS: Record<DateRangePreset, string> = {
  today: "Today",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  custom: "Custom Range",
};

export function AnalyticsDateRangeFilter({ preset }: { preset: DateRangePreset }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-wrap items-end gap-3">
      <Select
        aria-label="Date range"
        className="w-auto"
        value={preset}
        onChange={(e) => updateParam("range", e.target.value)}
      >
        {(Object.keys(PRESET_LABELS) as DateRangePreset[]).map((p) => (
          <option key={p} value={p}>
            {PRESET_LABELS[p]}
          </option>
        ))}
      </Select>

      {preset === "custom" && (
        <>
          <Input
            aria-label="From date"
            type="date"
            className="w-auto"
            defaultValue={searchParams.get("from") ?? ""}
            onChange={(e) => updateParam("from", e.target.value)}
          />
          <Input
            aria-label="To date"
            type="date"
            className="w-auto"
            defaultValue={searchParams.get("to") ?? ""}
            onChange={(e) => updateParam("to", e.target.value)}
          />
        </>
      )}
    </div>
  );
}
