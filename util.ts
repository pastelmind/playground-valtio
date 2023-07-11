import { getVersion } from "valtio";

export type { INTERNAL_Snapshot as Snapshot } from "valtio";

export function isProxy(value: unknown): boolean {
  return getVersion(value) !== undefined;
}

export function isSnapshot(value: unknown): boolean {
  // Exclude non-objects
  if (!(typeof value === "object" && value)) return false;

  // This relies on an implementation detail of Valtio 1.10.7:
  // snapshots disallow property addition, but allows removal
  const symbolKey = Symbol("temp key");
  try {
    // @ts-expect-error
    value[symbolKey] = 0;
    return false; // Property addition did not error, so not a snapshot
  } catch (error) {
    if (error instanceof TypeError) {
      return true; // Property addition failed, so a snapshot
    }
    throw error;
  } finally {
    // @ts-expect-error
    delete value[symbolKey];
  }
}

export function getValueType(value: unknown) {
  if (isProxy(value)) return "proxy";
  if (isSnapshot(value)) return "snapshot";
  return "plain";
}
