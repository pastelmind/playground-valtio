import { proxy, subscribe } from "valtio";

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

const store = proxy(new Station());

subscribe(store, () => console.log("Store updated to:", store), true);

console.log("Mutating array directly");
store.trains.push({ id: "train0", passengers: 100 });

// wait for subscription to fire

console.log("Calling mutation method");
store.addTrain({ id: "train1", passengers: 200 });
