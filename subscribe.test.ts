import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { proxy, subscribe } from "valtio";
import { sleep } from "./util.js";

describe("subscribe()", () => {
  it("If a sync listener throws, skips all subsequent sync listeners", () => {
    const store = proxy({ value: 0 });

    const syncListener1 = mock.fn();
    const syncListener2 = mock.fn(() => {
      throw new Error("Thrown by sync listener 2");
    });
    const syncListener3 = mock.fn();

    subscribe(store, syncListener1, true);
    subscribe(store, syncListener2, true);
    subscribe(store, syncListener3, true);

    // Trigger the listeners
    assert.throws(() => {
      store.value = 1;
    });

    assert.equal(syncListener1.mock.callCount(), 1);
    assert.equal(syncListener2.mock.callCount(), 1);
    assert.equal(syncListener3.mock.callCount(), 0);
  });

  it("If a sync listener throws, skips all subsequent async listeners", async () => {
    const store = proxy({ value: 0 });

    const syncListener1 = mock.fn(() => {
      throw new Error("Thrown by sync listener 1");
    });
    const asyncListener1 = mock.fn();
    const asyncListener2 = mock.fn();

    subscribe(store, asyncListener1);
    subscribe(store, syncListener1, true);
    subscribe(store, asyncListener2);

    // Trigger the listeners
    assert.throws(() => {
      store.value = 1;
    });
    // Wait so async listeners can fire
    await sleep(10);

    assert.equal(asyncListener1.mock.callCount(), 1);
    assert.equal(syncListener1.mock.callCount(), 1);
    assert.equal(asyncListener2.mock.callCount(), 0);
  });

  // Note: This test is broken because the test suite fails on an unhandled
  // promise rejection, and I don't know how to suppress this behavior.
  it.skip("If an async listener throws, other listeners are unaffected", async () => {
    const store = proxy({ value: 0 });

    const syncListener1 = mock.fn();
    const syncListener2 = mock.fn();
    const syncListener3 = mock.fn();
    const asyncListener1 = mock.fn(() => {
      throw new Error("Thrown by async listener 1");
    });
    const asyncListener2 = mock.fn(() => {
      throw new Error("Thrown by async listener 2");
    });

    subscribe(store, syncListener1, true);
    subscribe(store, asyncListener1);
    subscribe(store, syncListener2, true);
    subscribe(store, asyncListener2);
    subscribe(store, syncListener3, true);

    // Trigger the listeners
    // This will not throw
    store.value = 1;
    // Wait so async listeners can fire
    // await sleep(10);

    assert.equal(syncListener1.mock.callCount(), 1);
    assert.equal(syncListener2.mock.callCount(), 1);
    assert.equal(syncListener3.mock.callCount(), 1);
    assert.equal(asyncListener1.mock.callCount(), 1);
    assert.equal(asyncListener2.mock.callCount(), 1);
  });
});
