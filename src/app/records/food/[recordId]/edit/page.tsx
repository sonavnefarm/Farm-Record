import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { FoodRecordForm } from "@/components/records/FoodRecordForm";
import { getFoodRecord } from "@/lib/services/food";
import { listAnimals } from "@/lib/services/animals";
import { NotFoundError } from "@/lib/errors";

export default async function EditFoodRecordPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;

  let record;
  try {
    record = await getFoodRecord(recordId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const animals = await listAnimals();

  return (
    <>
      <PageHeader title="Edit Food Record" description="Update this record's details." />
      <Panel>
        <FoodRecordForm animals={animals} record={record} />
      </Panel>
    </>
  );
}
