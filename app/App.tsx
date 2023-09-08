import { useSnapshot } from "valtio";
import { proxyWithHistory } from "valtio/utils";
import styles from "./App.module.css";

const state = proxyWithHistory({ count: 0 });

const increase = () => {
  state.value.count += 100;
};
const decrease = () => {
  state.value.count -= 100;
};
const undo = () => {
  state.undo();
};
const redo = () => {
  state.redo();
};
const scrambleInPlace = () => {
  const count = Math.floor(Math.random() * 1000);

  // This doesn't work
  // state.value = { count };

  // This doesn't work
  // state.history.snapshots[state.history.index].count = count;

  // This works, but removes all "redo" history
  state.undo();
  state.value.count = count;
  state.saveHistory();
};
const forceSaveHistory = () => {
  // state.saveHistory();
  state.value.count = state.value.count;
};

export const App = () => {
  const snapshot = useSnapshot(state);

  return (
    <div>
      <section>
        <div>Count: {snapshot.value.count}</div>
        <div className={styles.ButtonGroup}>
          <button type="button" onClick={increase}>
            Increase
          </button>
          <button type="button" onClick={decrease}>
            Decrease
          </button>
        </div>
      </section>
      <footer>
        <div>
          History index: {snapshot.history.index} /{" "}
          {snapshot.history.snapshots.length}
        </div>
        <div className={styles.ButtonGroup}>
          <button type="button" onClick={undo} disabled={!snapshot.canUndo()}>
            Undo
          </button>
          <button type="button" onClick={redo} disabled={!snapshot.canRedo()}>
            Redo
          </button>
          <button type="button" onClick={scrambleInPlace}>
            Scramble in place
          </button>
          <button type="button" onClick={forceSaveHistory}>
            Force Save History
          </button>
        </div>
        <ol start={0}>
          {snapshot.history.snapshots.map((entry, index) => {
            const text = `Count: ${entry.count}`;
            return (
              <li key={index}>
                {index === snapshot.history.index ? <b>{text}</b> : text}
              </li>
            );
          })}
        </ol>
      </footer>
    </div>
  );
};
