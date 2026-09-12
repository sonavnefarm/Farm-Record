import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of your farm's animals and recent activity."
      />
      <EmptyState
        icon={LayoutDashboard}
        title="Dashboard is not built yet"
        description="Animal summaries, today's records, and the milk trend chart arrive in Phase 6, once animals and records exist."
      />
    </>
  );
}
