import { proxy, ref, subscribe } from "valtio";

type Ref<T extends object> = ReturnType<typeof ref<T>>;

function logExecute(stmt: string) {
  console.log(stmt);
  eval(stmt);
}

const store = proxy({
  foo: ref({ bar: "asdf" }),
  baz: 1,
});

subscribe(store, () => console.log(" -- STORE UPDATED:", store), true);

logExecute(`store.foo.bar = "woon"`);
logExecute(`store.foo = ref({ bar: "koko" })`);
logExecute(`store.foo.bar = "woon"`);
logExecute(`store.foo = { bar: "happy" }`);
logExecute(`store.foo.bar = "sad"`);
logExecute(`store.foo = ref({ bar: "angry" })`);
logExecute(`store.foo.bar = "curious"`);
