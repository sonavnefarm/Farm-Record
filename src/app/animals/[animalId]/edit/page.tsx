import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { AnimalForm } from "@/components/animals/AnimalForm";
import { getAnimal } from "@/lib/services/animals";
import { NotFoundError } from "@/lib/errors";

export default async function EditAnimalPage({
  params,
}: {
  params: Promise<{ animalId: string }>;
}) {
  const { animalId } = await params;

  let animal;
  try {
    animal = await getAnimal(animalId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <PageHeader title={`Edit ${animal.id}`} description="Update this animal's name or category." />
      <AnimalForm animal={animal} />
    </>
  );
}
