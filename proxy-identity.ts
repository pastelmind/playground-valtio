// Examine whether proxy is reused for same object

import { proxy } from "valtio";

function logEval(expr: string) {
  console.log(`${expr} ===`, eval(expr));
}

const obj = { foo: 1, bar: "number" };

// Calling proxy() twice on same object
const p1 = proxy(obj);
const p2 = proxy(obj);
logEval("Object.is(p1, p2)");

// Calling proxy() on object that is part of another state tree
const anotherObj = { baz: true };
const p3 = proxy({ wrapped: obj });
logEval("Object.is(p3.wrapped, p1)");

// Calling proxy() on object that is incorporated into an existing state tree
(p3 as Record<string, unknown>).another = anotherObj;
const p4 = proxy(anotherObj);
logEval("Object.is(p3.another, p4)");

// Calling proxy() on a proxy
const p5 = proxy(p1);
logEval("Object.is(p1, p5)");
