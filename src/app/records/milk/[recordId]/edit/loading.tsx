import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EditMilkRecordLoading() {
  return (
    <>
      <PageHeader title="Edit Milk Record" />
      <Skeleton className="h-24 w-full" />
    </>
  );
}
