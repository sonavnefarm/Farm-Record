import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EditMedicineRecordLoading() {
  return (
    <>
      <PageHeader title="Edit Medicine Record" />
      <Skeleton className="h-24 w-full" />
    </>
  );
}
