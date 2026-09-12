import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ANIMAL_CATEGORY_LABELS } from "@/types/animal";
import { getAnimal } from "@/lib/services/animals";
import { getAnimalFoodHistory } from "@/lib/services/food";
import { deactivateAnimalAction, reactivateAnimalAction } from "@/lib/actions/animals";
import { NotFoundError } from "@/lib/errors";
import { formatDate } from "@/lib/utils/date";
import { Wheat, Milk, Syringe } from "lucide-react";

export default async function AnimalProfilePage({
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

  const toggleAction =
    animal.status === "ACTIVE"
      ? deactivateAnimalAction.bind(null, animal.id)
      : reactivateAnimalAction.bind(null, animal.id);

  const foodHistory = await getAnimalFoodHistory(animal.id);

  return (
    <>
      <PageHeader
        title={animal.name ? `${animal.name} (${animal.id})` : animal.id}
        description={`${ANIMAL_CATEGORY_LABELS[animal.category]} · registered ${animal.createdAt.toLocaleDateString()}`}
        actions={
          <>
            <Link href={`/animals/${animal.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <form action={toggleAction}>
              <Button variant="secondary" type="submit">
                {animal.status === "ACTIVE" ? "Deactivate" : "Reactivate"}
              </Button>
            </form>
          </>
        }
      />

      <Panel className="mb-6">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Animal ID</dt>
            <dd className="mt-0.5 font-mono text-sm text-[var(--color-text)]">{animal.id}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Name</dt>
            <dd className="mt-0.5 text-sm text-[var(--color-text)]">
              {animal.name || <span className="text-[var(--color-text-faint)]">—</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Category</dt>
            <dd className="mt-0.5 text-sm text-[var(--color-text)]">
              {ANIMAL_CATEGORY_LABELS[animal.category]}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Status</dt>
            <dd className="mt-0.5">
              <StatusBadge status={animal.status} />
            </dd>
          </div>
        </dl>
      </Panel>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Food History</h2>
          {foodHistory.length === 0 ? (
            <EmptyState
              icon={Wheat}
              title="No food records yet"
              description="Log this animal's first food record from the Food Records page."
            />
          ) : (
            <div className="overflow-hidden rounded-md border border-[var(--color-border)]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-muted)]">
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="px-4 py-2.5 font-medium">Food Name</th>
                    <th className="px-4 py-2.5 font-medium">Quantity (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {foodHistory.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-[var(--color-border)] bg-[var(--color-surface)] last:border-b-0"
                    >
                      <td className="px-4 py-2.5 text-[var(--color-text)]">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-4 py-2.5 text-[var(--color-text)]">
                        {record.foodName || (
                          <span className="text-[var(--color-text-faint)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[13px] text-[var(--color-text)]">
                        {record.quantity.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Milk History</h2>
          <EmptyState
            icon={Milk}
            title="Milk history is not built yet"
            description="Milk records arrive in Phase 4."
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Medicine History</h2>
          <EmptyState
            icon={Syringe}
            title="Medicine history is not built yet"
            description="Medicine records arrive in Phase 5."
          />
        </section>
      </div>
    </>
  );
}
