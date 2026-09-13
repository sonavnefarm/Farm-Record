import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { MilkRecordForm } from "@/components/records/MilkRecordForm";
import { MilkRecordsTable } from "@/components/records/MilkRecordsTable";
import { RecordFilters } from "@/components/records/RecordFilters";
import { listMilkRecords } from "@/lib/services/milk";
import { listAnimals } from "@/lib/services/animals";
import { ANIMAL_CATEGORIES } from "@/types/animal";
import type { AnimalCategory } from "@/types/animal";
import { Milk } from "lucide-react";

export default async function MilkRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{
    animalId?: string;
    category?: string;
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
    listMilkRecords({
      animalId: params.animalId || undefined,
      category,
      dateFrom: params.dateFrom ? new Date(params.dateFrom) : undefined,
      dateTo: params.dateTo ? new Date(params.dateTo) : undefined,
    }),
  ]);

  const hasFilters = Boolean(
    params.animalId || params.category || params.dateFrom || params.dateTo,
  );

  return (
    <>
      <PageHeader
        title="Milk Records"
        description="Morning and evening milk yield per animal."
      />

      {animals.length === 0 ? (
        <EmptyState
          icon={Milk}
          title="Add an animal first"
          description="You need at least one animal on the farm before you can log a milk record."
        />
      ) : (
        <>
          <Panel className="mb-6">
            <MilkRecordForm animals={animals} />
          </Panel>

          <RecordFilters animals={animals} />

          {records.length === 0 ? (
            <EmptyState
              icon={Milk}
              title={hasFilters ? "No milk records match these filters" : "No milk records yet"}
              description={
                hasFilters
                  ? "Try a different animal, category, or date range."
                  : "Use the form above to log the first milk record."
              }
            />
          ) : (
            <MilkRecordsTable records={records} />
          )}
        </>
      )}
    </>
  );
}
