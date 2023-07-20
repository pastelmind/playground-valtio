import type { IsEqual } from "type-fest";
import { getVersion, type INTERNAL_Snapshot as Snapshot } from "valtio";

export type { Snapshot };

export type IsSnapshot<T extends object> = IsEqual<T, Snapshot<T>>;
export type MaybeSnapshot<T extends object> = T | Snapshot<T>;
export type Mutable<T extends object> = IsSnapshot<T> extends true ? never : T;

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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
