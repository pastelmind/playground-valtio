import * as assert from "node:assert/strict";

function makeProxy<T extends object>(obj: T): T {
  return new Proxy(obj, {
    get: (target, p, receiver) => {
      const value = Reflect.get(target, p, receiver);
      if (typeof value === "object" && value) {
        return makeProxy(value);
      }
      return value;
    },
  });
}

const obj = { name: "Robert", age: 80, company: { name: "Webtoon" } };
Object.freeze(obj);
const p = makeProxy(obj);

console.log(p);
console.log(p.name);
// This throws because the get trap for p.company attempts to return a proxy
// object wrapping obj.company, but the Proxy invariants require that p.company
// and obj.company return an identical value.
assert.throws(() => console.log(p.company), TypeError);
