// Examine whether subscribeKey() works for keys that do not exist yet

import { proxy } from "valtio";
import { subscribeKey } from "valtio/utils";

const store = proxy<Record<string, number>>({});

subscribeKey(store, "foo", (value) =>
  console.log("Value of foo updated:", value)
);
subscribeKey(
  store,
  "bar",
  (value) => console.log("Value of bar updated (sync):", value),
  true
);

console.log("Mutating store.foo to 1");
store.foo = 1;
console.log("Mutating store.foo to 1");
store.bar = 1;

setTimeout(() => {
  console.log("Mutating store.foo to 2");
  store.foo = 2;
  console.log("Mutating store.bar to 2");
  store.bar = 2;
}, 100);

setTimeout(() => {
  console.log("Mutating store.foo to 3");
  store.foo = 3;
  console.log("Mutating store.bar to 3");
  store.bar = 3;
}, 200);

setTimeout(() => {
  console.log("Mutating store.foo to 3");
  store.foo = 3;
  console.log("Mutating store.bar to 3");
  store.bar = 3;
}, 300);

setTimeout(() => {
  console.log("Mutating store.foo to 3");
  store.foo = 3;
  console.log("Mutating store.bar to 3");
  store.bar = 3;
}, 400);
