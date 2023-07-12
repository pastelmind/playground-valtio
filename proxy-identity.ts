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

// Identity of object added at multiple locations within the state tree
const p6 = proxy<Record<string, unknown>>({});
const child6 = { foo: 1 };
p6.a = child6;
p6.b = child6;
logEval("Object.is(p6.a, p6.b)");

// Identity of proxy added at multiple locations within the state tree
const p7 = proxy<Record<string, Child7>>({});
const child7 = { foo: 1 };
type Child7 = typeof child7;
p7.a = child7;
p7.b = p7.a;
logEval("Object.is(p7.a, p7.b)");
p7.a.foo = 2;
logEval("p7.a.foo");
logEval("p7.b.foo");
