import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AnimalProfileLoading() {
  return (
    <>
      <PageHeader title="Loading..." />
      <Skeleton className="mb-6 h-28 w-full" />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </>
  );
}
