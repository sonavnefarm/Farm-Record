import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { AnimalFilters } from "@/components/animals/AnimalFilters";
import { AnimalsTable } from "@/components/animals/AnimalsTable";
import { listAnimals } from "@/lib/services/animals";
import { ANIMAL_CATEGORIES, ANIMAL_STATUSES } from "@/types/animal";
import type { AnimalCategory, AnimalStatus } from "@/types/animal";
import { PawPrint } from "lucide-react";

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>;
}) {
  const params = await searchParams;
  const category = ANIMAL_CATEGORIES.includes(params.category as AnimalCategory)
    ? (params.category as AnimalCategory)
    : undefined;
  const status = ANIMAL_STATUSES.includes(params.status as AnimalStatus)
    ? (params.status as AnimalStatus)
    : undefined;

  const animals = await listAnimals({ category, status });
  const hasFilters = Boolean(category || status);

  return (
    <>
      <PageHeader
        title="Animals"
        description="Buffaloes, cows, and goats on the farm."
        actions={
          <Link href="/animals/new">
            <Button>Add animal</Button>
          </Link>
        }
      />
      <AnimalFilters />
      {animals.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title={
            hasFilters
              ? "No animals match these filters"
              : "No animals have been added yet"
          }
          description={
            hasFilters
              ? "Try a different category or status."
              : "Add your first animal to start tracking your farm."
          }
          action={
            !hasFilters && (
              <Link href="/animals/new">
                <Button>Add animal</Button>
              </Link>
            )
          }
        />
      ) : (
        <AnimalsTable animals={animals} />
      )}
    </>
  );
}
