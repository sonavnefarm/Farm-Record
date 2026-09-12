import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Animal, milk, food, and medicine trends across the farm."
      />
      <EmptyState
        icon={BarChart3}
        title="Analytics is not built yet"
        description="Milk, food, animal, and medicine analytics arrive in Phase 7, once there is data to analyze."
      />
    </>
  );
}
