import * as assert from "node:assert/strict";
import { proxy, subscribe } from "valtio";

interface Train {
  id: string;
  passengers: number;
}

class Station {
  #trains: Train[] = [];

  get trains() {
    return this.#trains;
  }

  addTrain(train: Train) {
    this.#trains.push(train);
  }
}

const store = proxy(new Station());

subscribe(store, () => console.log("Store updated to:", store), true);

// The following code errors at runtime because the '#trains' property is not
// available on the proxy object

console.log("Mutating array directly");
assert.throws(
  () => store.trains.push({ id: "train0", passengers: 100 }),
  TypeError
);

console.log("Calling mutation method");
assert.throws(
  () => store.addTrain({ id: "train1", passengers: 200 }),
  TypeError
);
