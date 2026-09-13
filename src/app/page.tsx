import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { MilkTrendChart } from "@/components/dashboard/MilkTrendChart";
import {
  getAnimalSummary,
  getTodayStats,
  getMilkTrend,
  getRecentActivity,
} from "@/lib/services/dashboard";
import { PawPrint } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const days = params.range === "30" ? 30 : 7;

  const summary = await getAnimalSummary();

  if (summary.total === 0) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          description="An overview of your farm's animals and recent activity."
        />
        <EmptyState
          icon={PawPrint}
          title="No animals have been added yet"
          description="Add your first animal to start tracking your farm."
          action={
            <Link href="/animals/new">
              <Button>Add animal</Button>
            </Link>
          }
        />
      </>
    );
  }

  const [today, trend, activity] = await Promise.all([
    getTodayStats(),
    getMilkTrend(days),
    getRecentActivity(8),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of your farm's animals and recent activity."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Animals" value={summary.total} />
        <StatCard label="Buffaloes" value={summary.byCategory.BUFFALO} />
        <StatCard label="Cows" value={summary.byCategory.COW} />
        <StatCard label="Goats" value={summary.byCategory.GOAT} />
        <StatCard label="Active" value={summary.active} />
        <StatCard label="Inactive" value={summary.inactive} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Today's Milk" value={`${today.milkTotal.toFixed(2)} L`} />
        <StatCard label="Today's Food" value={`${today.foodTotal.toFixed(2)} kg`} />
        <StatCard label="Today's Medicine Records" value={today.medicineCount} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MilkTrendChart data={trend} days={days} />
        <RecentActivityList items={activity} />
      </div>
    </>
  );
}
