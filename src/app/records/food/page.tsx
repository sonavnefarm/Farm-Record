import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { FoodRecordForm } from "@/components/records/FoodRecordForm";
import { FoodRecordsTable } from "@/components/records/FoodRecordsTable";
import { RecordFilters } from "@/components/records/RecordFilters";
import { listFoodRecords } from "@/lib/services/food";
import { listAnimals } from "@/lib/services/animals";
import { ANIMAL_CATEGORIES } from "@/types/animal";
import type { AnimalCategory } from "@/types/animal";
import { Wheat } from "lucide-react";

export default async function FoodRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{
    animalId?: string;
    category?: string;
    foodName?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const params = await searchParams;
  const category = ANIMAL_CATEGORIES.includes(params.category as AnimalCategory)
    ? (params.category as AnimalCategory)
    : undefined;

  const [animals, records] = await Promise.all([
    listAnimals(),
    listFoodRecords({
      animalId: params.animalId || undefined,
      category,
      foodName: params.foodName || undefined,
      dateFrom: params.dateFrom ? new Date(params.dateFrom) : undefined,
      dateTo: params.dateTo ? new Date(params.dateTo) : undefined,
    }),
  ]);

  const hasFilters = Boolean(
    params.animalId || params.category || params.foodName || params.dateFrom || params.dateTo,
  );

  return (
    <>
      <PageHeader
        title="Food Records"
        description="Daily food quantities logged per animal."
      />

      {animals.length === 0 ? (
        <EmptyState
          icon={Wheat}
          title="Add an animal first"
          description="You need at least one animal on the farm before you can log a food record."
        />
      ) : (
        <>
          <Panel className="mb-6">
            <FoodRecordForm animals={animals} />
          </Panel>

          <RecordFilters animals={animals} showFoodName />

          {records.length === 0 ? (
            <EmptyState
              icon={Wheat}
              title={hasFilters ? "No food records match these filters" : "No food records yet"}
              description={
                hasFilters
                  ? "Try a different animal, category, or date range."
                  : "Use the form above to log the first food record."
              }
            />
          ) : (
            <FoodRecordsTable records={records} />
          )}
        </>
      )}
    </>
  );
}
