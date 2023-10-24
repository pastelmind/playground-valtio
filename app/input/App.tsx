import type { ChangeEvent } from "react";
import { proxy, useSnapshot } from "valtio";
import "./App.css";

const store = proxy({ value: "foo" });
const update = (event: ChangeEvent<HTMLInputElement>) => {
  store.value = event.target.value;
};

const storeSync = proxy({ value: "foo" });
const updateSync = (event: ChangeEvent<HTMLInputElement>) => {
  storeSync.value = event.target.value;
};

export const App = () => {
  const { value } = useSnapshot(store);
  const { value: valueSync } = useSnapshot(storeSync, { sync: true });

  return (
    <>
      <p>
        Try typing in English or Korean. The regular input is buggy for Korean,
        but the sync subscription works fine.
      </p>
      <div>
        <label htmlFor="input-regular">
          Input backed by <code>useSnapshot(store)</code>:&nbsp;
        </label>
        <input id="input-regular" type="text" value={value} onChange={update} />
      </div>
      <div>
        <label htmlFor="input-sync">
          Input backed by{" "}
          <code>
            useSnapshot(store, {"{"} sync: true {"}"})
          </code>
          :&nbsp;
        </label>
        <input
          id="input-sync"
          type="text"
          value={valueSync}
          onChange={updateSync}
        />
      </div>
    </>
  );
};
