import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { proxy, subscribe } from "valtio";
import { sleep } from "./util.js";

class ValtioProxy {
  constructor() {
    return proxy(this);
  }
}

abstract class A extends ValtioProxy {
  constructor() {
    super();
  }
  foo = {
    name: "abc",
  };
}

class B extends A {
  bar = {
    age: 123,
  };

  constructor(readonly baz = "asdf") {
    super();
  }
}

describe("ValtioProxy subclass", () => {
  it("proxy is instance of all parent classes", () => {
    const p = new B();
    assert.ok(p instanceof ValtioProxy);
    assert.ok(p instanceof A);
    assert.ok(p instanceof B);
  });

  it("all fields are reactive", async () => {
    const listener = mock.fn();
    const p = new B();
    subscribe(p, listener);

    p.foo = { name: "def" };
    await sleep(10);
    assert.equal(listener.mock.callCount(), 1);

    // This one works in Valtio >= 1.11.0, or with useDefineForClassFields: false
    p.bar.age = 456;
    await sleep(10);
    assert.equal(listener.mock.callCount(), 2);
  });
});

console.log(B.toString());
