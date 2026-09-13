/**
 * Compute total milk yield from morning + evening readings. Pulled out as a
 * pure function (rather than inlined in the service layer) specifically so
 * it can be unit tested without a database — see milk.test.ts.
 *
 * Rounds to 2 decimal places to match the schema's Decimal(6,2) column and
 * avoid floating-point artifacts like 5.2 + 4.8 = 9.999999999999998.
 */
export function computeTotalMilk(morningMilk: number, eveningMilk: number): number {
  return Math.round((morningMilk + eveningMilk) * 100) / 100;
}
