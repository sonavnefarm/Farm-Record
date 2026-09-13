import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function MilkRecordsLoading() {
  return (
    <>
      <PageHeader title="Milk Records" description="Morning and evening milk yield per animal." />
      <Skeleton className="mb-6 h-24 w-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </>
  );
}
