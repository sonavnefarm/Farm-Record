import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { MedicineRecordForm } from "@/components/records/MedicineRecordForm";
import { MedicineRecordsTable } from "@/components/records/MedicineRecordsTable";
import { RecordFilters } from "@/components/records/RecordFilters";
import { listMedicineRecords } from "@/lib/services/medicine";
import { listAnimals } from "@/lib/services/animals";
import { ANIMAL_CATEGORIES } from "@/types/animal";
import type { AnimalCategory } from "@/types/animal";
import { Syringe } from "lucide-react";

export default async function MedicineRecordsPage({
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
    listMedicineRecords({
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
        title="Medicine Records"
        description="A simple history of which medicine an animal took, and when."
      />

      {animals.length === 0 ? (
        <EmptyState
          icon={Syringe}
          title="Add an animal first"
          description="You need at least one animal on the farm before you can log a medicine record."
        />
      ) : (
        <>
          <Panel className="mb-6">
            <MedicineRecordForm animals={animals} />
          </Panel>

          <RecordFilters animals={animals} />

          {records.length === 0 ? (
            <EmptyState
              icon={Syringe}
              title={hasFilters ? "No medicine records match these filters" : "No medicine records yet"}
              description={
                hasFilters
                  ? "Try a different animal, category, or date range."
                  : "Use the form above to log the first medicine record."
              }
            />
          ) : (
            <MedicineRecordsTable records={records} />
          )}
        </>
      )}
    </>
  );
}
