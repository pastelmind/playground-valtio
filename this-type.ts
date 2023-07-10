// This example shows how to declare the types of methods that return correctly
// typed data, regardless of whether the object is a proxy or snapshot.

import { expectTypeOf } from "expect-type";
import { proxy, snapshot, INTERNAL_Snapshot as Snapshot } from "valtio";

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
