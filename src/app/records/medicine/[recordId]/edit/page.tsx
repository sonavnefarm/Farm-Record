import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { MedicineRecordForm } from "@/components/records/MedicineRecordForm";
import { getMedicineRecord } from "@/lib/services/medicine";
import { listAnimals } from "@/lib/services/animals";
import { NotFoundError } from "@/lib/errors";

export default async function EditMedicineRecordPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;

  let record;
  try {
    record = await getMedicineRecord(recordId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const animals = await listAnimals();

  return (
    <>
      <PageHeader title="Edit Medicine Record" description="Update this record's details." />
      <Panel>
        <MedicineRecordForm animals={animals} record={record} />
      </Panel>
    </>
  );
}
