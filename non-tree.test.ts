import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { proxy, subscribe } from "valtio";
import { sleep } from "./util.js";

describe("Non-tree graphs", () => {
  it("Updating an object should invoke listeners of all parent objects that reference it", async () => {
    //  /--<-- B <--\
    // A             +-- D
    //  \--<-- C <--/

    interface StoreA {
      value: number;
    }
    interface StoreB {
      a: StoreA;
    }
    interface StoreC {
      a?: StoreA;
    }
    interface StoreD {
      b?: StoreB;
      c?: StoreC;
    }

    const b = proxy<StoreB>({ a: { value: 0 } });
    const c = proxy<StoreC>({});
    const d = proxy<StoreD>({});

    const a = b.a;
    c.a = a;
    d.b = b;
    d.c = c;

    const listenerA = mock.fn();
    const listenerB = mock.fn();
    const listenerC = mock.fn();
    const listenerD = mock.fn();

    subscribe(a, listenerA);
    subscribe(b, listenerB);
    subscribe(c, listenerC);
    subscribe(d, listenerD);
    assert.equal(listenerA.mock.callCount(), 0);
    assert.equal(listenerB.mock.callCount(), 0);
    assert.equal(listenerC.mock.callCount(), 0);
    assert.equal(listenerD.mock.callCount(), 0);

    a.value = 1;
    await sleep(10);

    assert.equal(listenerA.mock.callCount(), 1);
    assert.equal(listenerB.mock.callCount(), 1);
    assert.equal(listenerC.mock.callCount(), 1);
    assert.equal(listenerD.mock.callCount(), 1);
  });
});
