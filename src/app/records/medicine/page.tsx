import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Syringe } from "lucide-react";

export default function MedicineRecordsPage() {
  return (
    <>
      <PageHeader
        title="Medicine Records"
        description="A simple history of which medicine an animal took, and when."
        actions={<Button disabled>Add medicine record</Button>}
      />
      <EmptyState
        icon={Syringe}
        title="Medicine records are not built yet"
        description="Logging medicine history arrives in Phase 5."
      />
    </>
  );
}
