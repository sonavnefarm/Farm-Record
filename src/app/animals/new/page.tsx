import { PageHeader } from "@/components/ui/PageHeader";
import { AnimalForm } from "@/components/animals/AnimalForm";

export default function NewAnimalPage() {
  return (
    <>
      <PageHeader
        title="Add Animal"
        description="Register a new buffalo, cow, or goat."
      />
      <AnimalForm />
    </>
  );
}
