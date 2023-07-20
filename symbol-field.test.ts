import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { proxy, subscribe } from "valtio";
import { sleep } from "./util.js";

interface Train {
  id: string;
  passengers: number;
}

const KEY_TRAINS = Symbol("trains");

class Station {
  private [KEY_TRAINS]: Train[] = [];

  get trains() {
    return this[KEY_TRAINS];
  }

  addTrain(train: Train) {
    this[KEY_TRAINS].push(train);
  }
}

describe("Symbol key property", () => {
  it("Direct mutation should notify subscribers", async () => {
    const listener = mock.fn();
    const store = proxy(new Station());
    subscribe(store, listener);
    assert.equal(listener.mock.callCount(), 0);

    store.trains.push({ id: "train0", passengers: 100 });
    await sleep(10);
    assert.equal(listener.mock.callCount(), 1);
  });

  it("Calling a mutation method should notify subscribers", async () => {
    const listener = mock.fn();
    const store = proxy(new Station());
    subscribe(store, listener);
    assert.equal(listener.mock.callCount(), 0);

    store.addTrain({ id: "train1", passengers: 200 });
    await sleep(10);
    assert.equal(listener.mock.callCount(), 1);
  });
});
