// This example shows how to declare the types of methods that return correctly
// typed data, regardless of whether the object is a proxy or snapshot.

import { expectTypeOf } from "expect-type";
import assert from "node:assert/strict";
import { proxy, snapshot } from "valtio";
import type { MaybeSnapshot, Mutable, Snapshot } from "./util.js";

interface Pet {
  name: string;
  age: number;
}

interface ObjStore {
  ages: number[];
  pets: Pet[];
  getAges<T extends Snapshot<this>>(this: T): T["ages"];
  getPets: <T extends Snapshot<this>>(this: T) => T["pets"];
}

const objStore = proxy<ObjStore>({
  ages: [50, 30, 40],
  pets: [],
  getAges() {
    return this.ages;
  },
  getPets() {
    return this.pets;
  },
});

const objSnap = snapshot(objStore);

expectTypeOf(objStore.getAges()).toEqualTypeOf<number[]>();
expectTypeOf(objSnap.getAges()).toEqualTypeOf<readonly number[]>();
expectTypeOf(objStore.getPets()).toEqualTypeOf<Pet[]>();
expectTypeOf(objSnap.getPets()).toEqualTypeOf<readonly Readonly<Pet>[]>();

class ClassStore {
  ages: number[] = [];
  pets: Pet[] = [];
  getAges<T extends Snapshot<this>>(this: T): T["ages"] {
    return this.ages;
  }
  getPets<T extends Snapshot<this>>(this: T): T["pets"] {
    return this.pets;
  }
}

const classStore = proxy(new ClassStore());

const classSnap = snapshot(classStore);

expectTypeOf(classStore.getAges()).toEqualTypeOf<number[]>();
expectTypeOf(classSnap.getAges()).toEqualTypeOf<readonly number[]>();
expectTypeOf(classStore.getPets()).toEqualTypeOf<Pet[]>();
expectTypeOf(classSnap.getPets()).toEqualTypeOf<readonly Readonly<Pet>[]>();

interface Pilot {
  name: string;
  age: number;
}

class Airplane {
  pilot?: Pilot;

  getPilot<Self extends MaybeSnapshot<this>>(this: Self) {
    if (!this.pilot) return null;
    return this.pilot as NonNullable<Self["pilot"]>;
  }

  setPilot<Self extends this>(this: Mutable<Self>, pilot: Pilot) {
    if (this.getPilot()?.name === pilot.name) {
      throw new Error("Pilot already exists");
    }
    this.pilot = pilot;
  }
}

const airplaneStore = proxy(new Airplane());
const airplaneSnap = snapshot(airplaneStore);

expectTypeOf(airplaneStore.getPilot()).toEqualTypeOf<Pilot | null>();
expectTypeOf(airplaneSnap.getPilot()).toEqualTypeOf<Snapshot<Pilot> | null>();

airplaneStore.setPilot({ name: "mika", age: 50 });
assert.throws(() => {
  // @ts-expect-error
  airplaneSnap.setPilot({ name: "margo", age: 40 });
});
