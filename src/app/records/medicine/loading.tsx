import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MedicineRecordsLoading() {
  return (
    <>
      <PageHeader
        title="Medicine Records"
        description="A simple history of which medicine an animal took, and when."
      />
      <Skeleton className="mb-6 h-24 w-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </>
  );
}
