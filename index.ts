import * as assert from "node:assert/strict";
import { proxy, snapshot, subscribe } from "valtio";
import { isProxy } from "./util.js";

class State {
  names: string[] = ["foo", "bar", "baz"];
  values: Record<string, number> = { foo: 1 };

  getNames() {
    console.log(`[getNames] I ${isProxy(this) ? "am" : "am not"} a proxy`);
    return this.names;
  }
}

const store = proxy(new State());

// Let's listen to state changes
subscribe(store, () => console.log("state changed to:", store), true);

console.log("Testing store proxy...");
store.getNames();

console.log("Testing snapshot...");
const snap = snapshot(store);
snap.names; //      ✅ readonly string[]
snap.getNames(); // ❌ string[]

// This throws as of Valtio 1.10.7
assert.throws(() => {
  // @ts-expect-error This is prevented by Snapshot<T>
  snap.names.push("foo");
});

// ❗️ This will NOT throw at runtime, but silently ignored
// @ts-expect-error This is prevented by Snapshot<T>
snap.names.pop();
console.log("state:", store);

// This throws as of Valtio 1.10.7
assert.throws(() => {
  // @ts-expect-error This is prevented by Snapshot<T>
  snap.names[0] = "asdf";
});

// This throws as of Valtio 1.10.7
assert.throws(() => {
  // This is not guarded by TypeScript
  snap.getNames().push("foo");
});
console.log("state:", store);

// ✅ This WILL throw at runtime
assert.throws(() => {
  // @ts-expect-error This is prevented by Snapshot<T>
  snap.names = ["asdf"];
});

// 🚨 This will NOT throw at runtime
// @ts-expect-error This is prevented by Snapshot<T>
delete snap.values.foo;
console.log("snap:", snap.values.foo);
console.log("state:", store);

const p = proxy({ foo: 1 });
const s = snapshot(p);
console.log(s);
// @ts-expect-error Guarded by Snapshot<T> but not prevented at runtime
s.bar = 2;
console.log(s);
// @ts-expect-error Guarded by Snapshot<T> but not prevented at runtime
delete s.foo;
console.log(s);
