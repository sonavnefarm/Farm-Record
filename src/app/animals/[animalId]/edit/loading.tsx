import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EditAnimalLoading() {
  return (
    <>
      <PageHeader title="Edit Animal" />
      <div className="flex max-w-md flex-col gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </>
  );
}
