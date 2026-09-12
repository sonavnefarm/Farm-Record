import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Milk } from "lucide-react";

export default function MilkRecordsPage() {
  return (
    <>
      <PageHeader
        title="Milk Records"
        description="Morning and evening milk yield per animal."
        actions={<Button disabled>Add milk record</Button>}
      />
      <EmptyState
        icon={Milk}
        title="Milk records are not built yet"
        description="Logging milk yield with automatic totals arrives in Phase 4."
      />
    </>
  );
}
