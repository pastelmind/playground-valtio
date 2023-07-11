import { expectTypeOf } from "expect-type";
import { proxy, snapshot } from "valtio";
import { getValueType, type Snapshot } from "./util.js";

interface User {
  name: string;
  age: number;
}

class State {
  names: string[] = [];
  users: User[] = [
    { name: "John", age: 20 },
    { name: "Meg", age: 25 },
  ];

  get usersGetter() {
    return this.users;
  }

  getNames() {
    return this.names;
  }

  getUsers() {
    return this.users;
  }

  getUser<This extends Snapshot<this>>(
    this: This,
    i: number
  ): This["users"][number] {
    return this.users[i];
  }
}

const raw = new State();
const store = proxy(raw);
const snap = snapshot(store);

console.log("Type of raw.getUsers():  ", getValueType(raw.getUsers()));
console.log("Type of store.getUsers():", getValueType(store.getUsers()));
console.log("Type of snap.getUsers(): ", getValueType(snap.getUsers()));

console.log("Type of raw.usersGetter: ", getValueType(raw.usersGetter));
console.log("Type of store.getUser(1):", getValueType(store.getUser(1)));
console.log("Type of snap.getUser(1): ", getValueType(snap.getUser(1)));

expectTypeOf(raw.getUser(1)).toEqualTypeOf<User>();
expectTypeOf(store.getUser(1)).toEqualTypeOf<User>();
expectTypeOf(snap.getUser(1)).toEqualTypeOf<Readonly<User>>();

console.log("Type of raw.usersGetter:  ", getValueType(raw.usersGetter));
console.log("Type of store.usersGetter:", getValueType(store.usersGetter));
console.log("Type of snap.usersGetter: ", getValueType(snap.usersGetter));

expectTypeOf(raw.usersGetter).toEqualTypeOf<User[]>();
expectTypeOf(store.usersGetter).toEqualTypeOf<User[]>();
expectTypeOf(snap.usersGetter).toEqualTypeOf<readonly Readonly<User>[]>();
