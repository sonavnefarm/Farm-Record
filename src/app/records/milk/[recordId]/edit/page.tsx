import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { MilkRecordForm } from "@/components/records/MilkRecordForm";
import { getMilkRecord } from "@/lib/services/milk";
import { listAnimals } from "@/lib/services/animals";
import { NotFoundError } from "@/lib/errors";

export default async function EditMilkRecordPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;

  let record;
  try {
    record = await getMilkRecord(recordId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const animals = await listAnimals();

  return (
    <>
      <PageHeader title="Edit Milk Record" description="Update this record's details." />
      <Panel>
        <MilkRecordForm animals={animals} record={record} />
      </Panel>
    </>
  );
}
