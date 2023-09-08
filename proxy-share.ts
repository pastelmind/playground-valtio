// 두 개의 store가 같은 proxy 객체를 공유할 수 있는가?

import { proxy, subscribe } from "valtio";

function logEval(expr: string) {
  console.log(`${expr} ===`, eval(expr));
}

function logExecute(stmt: string) {
  console.log(stmt);
  eval(stmt);
}

interface User {
  name: string;
  age: number;
}

interface Store {
  user?: User;
}

const store1 = proxy<Store>({
  user: { name: "John", age: 20 },
});

const store2 = proxy<Store>({
  user: undefined,
});

subscribe(store1, () => console.log("Store1 changed to", store1), true);
subscribe(store2, () => console.log("Store2 changed to", store1), true);

logExecute("store2.user = store1.user");
logExecute('store1.user.name = "Mary"');
