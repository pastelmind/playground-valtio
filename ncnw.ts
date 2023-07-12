import { proxy } from "valtio";

const obj = { name: "Robert", age: 80, company: { name: "Webtoon" } };
Object.freeze(obj);
const p = proxy(obj);

console.log(p);
console.log(p.name);
// This works in Valtio v1 because proxy() creates a copy of the object. This is
// necessary to enable obj.company (original) and p.company (wraps obj.company)
// to be different values.
console.log(p.company);
