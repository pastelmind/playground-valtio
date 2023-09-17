import { proxy, useSnapshot } from "valtio";
import { proxyWithHistory } from "valtio/utils";
import styles from "./App.module.css";

const createHistory = () => proxyWithHistory({ count: 0 });

const state = proxy({
  history: createHistory(),
});

const increase = () => {
  state.history.value.count += 100;
};
const decrease = () => {
  state.history.value.count -= 100;
};
const undo = () => {
  state.history.undo();
};
const redo = () => {
  state.history.redo();
};
const scrambleInPlace = () => {
  const count = Math.floor(Math.random() * 1000);

  // This doesn't work
  // state.history.value = { count };

  // This doesn't work
  // state.history.history.snapshots[state.history.history.index].count = count;

  // This works, but removes all "redo" history
  state.history.undo();
  state.history.value.count = count;
  state.history.saveHistory();
};
const forceSaveHistory = () => {
  // state.history.saveHistory();
  state.history.value.count = state.history.value.count;
};
const resetHistory = () => {
  state.history = createHistory();
};

export const App = () => {
  const snapshot = useSnapshot(state);

  return (
    <div>
      <section>
        <div>Count: {snapshot.history.value.count}</div>
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
          History index: {snapshot.history.history.index} /{" "}
          {snapshot.history.history.snapshots.length}
        </div>
        <div className={styles.ButtonGroup}>
          <button
            type="button"
            onClick={undo}
            disabled={!snapshot.history.canUndo()}
          >
            Undo
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!snapshot.history.canRedo()}
          >
            Redo
          </button>
          <button type="button" onClick={scrambleInPlace}>
            Scramble in place
          </button>
          <button type="button" onClick={forceSaveHistory}>
            Force Save History
          </button>
          <button type="button" onClick={resetHistory}>
            Reset history
          </button>
        </div>
        <ol start={0}>
          {snapshot.history.history.snapshots.map((entry, index) => {
            const text = `Count: ${entry.count}`;
            return (
              <li key={index}>
                {index === snapshot.history.history.index ? (
                  <b>{text}</b>
                ) : (
                  text
                )}
              </li>
            );
          })}
        </ol>
      </footer>
    </div>
  );
};
