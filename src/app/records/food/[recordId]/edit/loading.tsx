import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EditFoodRecordLoading() {
  return (
    <>
      <PageHeader title="Edit Food Record" />
      <Skeleton className="h-24 w-full" />
    </>
  );
}
