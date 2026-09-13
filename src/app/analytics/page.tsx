import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatCard } from "@/components/dashboard/StatCard";
import { AnalyticsDateRangeFilter } from "@/components/analytics/AnalyticsDateRangeFilter";
import { ByAnimalTable } from "@/components/analytics/ByAnimalTable";
import { ByCategoryStats } from "@/components/analytics/ByCategoryStats";
import { RecentMedicineList } from "@/components/analytics/RecentMedicineList";
import { TrendChart } from "@/components/charts/TrendChart";
import {
  getAnimalAnalytics,
  getMilkAnalytics,
  getFoodAnalytics,
  getMedicineAnalytics,
} from "@/lib/services/analytics";
import { resolveDateRange } from "@/lib/utils/date-ranges";
import type { DateRangePreset } from "@/lib/utils/date-ranges";

const VALID_PRESETS: DateRangePreset[] = ["today", "7d", "30d", "custom"];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const preset = VALID_PRESETS.includes(params.range as DateRangePreset)
    ? (params.range as DateRangePreset)
    : "7d";
  const range = resolveDateRange(preset, { from: params.from, to: params.to });

  const [animalAnalytics, milkAnalytics, foodAnalytics, medicineAnalytics] = await Promise.all([
    getAnimalAnalytics(),
    getMilkAnalytics(range),
    getFoodAnalytics(range),
    getMedicineAnalytics(range),
  ]);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Animal, milk, food, and medicine trends across the farm."
      />

      <AnalyticsDateRangeFilter preset={preset} />

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Animal Analytics</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Total Animals" value={animalAnalytics.total} />
            <StatCard label="Buffaloes" value={animalAnalytics.byCategory.BUFFALO} />
            <StatCard label="Cows" value={animalAnalytics.byCategory.COW} />
            <StatCard label="Goats" value={animalAnalytics.byCategory.GOAT} />
            <StatCard label="Active" value={animalAnalytics.active} />
            <StatCard label="Inactive" value={animalAnalytics.inactive} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Milk Analytics</h2>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="Total Milk" value={`${milkAnalytics.totalMilk.toFixed(2)} L`} />
            <StatCard label="Average Daily Milk" value={`${milkAnalytics.averageDailyMilk.toFixed(2)} L`} />
            <StatCard
              label="Highest Producer"
              value={
                milkAnalytics.highestProducer
                  ? `${milkAnalytics.highestProducer.animalId} (${milkAnalytics.highestProducer.total.toFixed(2)} L)`
                  : "—"
              }
            />
          </div>
          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel>
              <h3 className="mb-3 text-xs font-medium text-[var(--color-text-muted)]">
                Production Trend
              </h3>
              <TrendChart
                data={milkAnalytics.trend.map((p) => ({ date: p.date, value: p.total }))}
                unitSuffix=" L"
                tooltipLabel="Total milk"
              />
            </Panel>
            <Panel>
              <h3 className="mb-3 text-xs font-medium text-[var(--color-text-muted)]">By Category (L)</h3>
              <ByCategoryStats data={milkAnalytics.byCategory} />
            </Panel>
          </div>
          <h3 className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">By Animal</h3>
          <ByAnimalTable data={milkAnalytics.byAnimal} valueLabel="Total (L)" />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Food Analytics</h2>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatCard label="Total Food Quantity" value={`${foodAnalytics.totalQuantity.toFixed(2)} kg`} />
            <StatCard
              label="Average Daily Quantity"
              value={`${foodAnalytics.averageDailyQuantity.toFixed(2)} kg`}
            />
          </div>
          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel>
              <h3 className="mb-3 text-xs font-medium text-[var(--color-text-muted)]">By Category (kg)</h3>
              <ByCategoryStats data={foodAnalytics.byCategory} />
            </Panel>
            <Panel>
              <h3 className="mb-3 text-xs font-medium text-[var(--color-text-muted)]">By Food Name</h3>
              {foodAnalytics.byFoodName.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">No data for this range yet.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-[var(--color-border)]">
                  {foodAnalytics.byFoodName.map((item) => (
                    <li key={item.foodName} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-[var(--color-text)]">{item.foodName}</span>
                      <span className="font-mono text-[13px] text-[var(--color-text-muted)]">
                        {item.total.toFixed(2)} kg
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
          <h3 className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">By Animal</h3>
          <ByAnimalTable data={foodAnalytics.byAnimal} valueLabel="Total (kg)" />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Medicine Analytics</h2>
          <p className="mb-4 text-xs text-[var(--color-text-faint)]">
            History only — this section does not provide medical interpretation or recommendations.
          </p>
          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel>
              <h3 className="mb-3 text-xs font-medium text-[var(--color-text-muted)]">Usage by Date</h3>
              <TrendChart
                data={medicineAnalytics.usageByDate.map((p) => ({ date: p.date, value: p.count }))}
                unitSuffix=""
                tooltipLabel="Records"
              />
            </Panel>
            <Panel>
              <h3 className="mb-3 text-xs font-medium text-[var(--color-text-muted)]">Recent Records</h3>
              <RecentMedicineList records={medicineAnalytics.recent} />
            </Panel>
          </div>
          <h3 className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">History by Animal</h3>
          <ByAnimalTable
            data={medicineAnalytics.byAnimal}
            valueLabel="Record Count"
            formatValue={(v) => v.toFixed(0)}
          />
        </section>
      </div>
    </>
  );
}
