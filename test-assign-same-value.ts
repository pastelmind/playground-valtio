import { proxy, subscribe } from "valtio";

const store = proxy({ value: 1 });

subscribe(store, () => {
  console.log("value changed to", store.value);
});

setTimeout(() => {
  store.value = 2;
}, 1000);

setTimeout(() => {
  store.value = 2;
}, 2000);
