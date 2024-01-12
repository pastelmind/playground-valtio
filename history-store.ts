import type { ReadonlyDeep } from "type-fest";
import { proxy, subscribe } from "valtio";

/** 실행 취소/다시 실행 기능을 제공하는 간단한 store */
interface HistoryStore<T> {
  /** 저장된 히스토리 항목 */
  readonly snapshots: ReadonlyDeep<T>[];
  /**
   * 히스토리에서 현재 시점을 나타내는 인덱스.
   * 이 값을 변경하면 {@link value}의 값도 바뀐다.
   */
  index: number;

  /** 히스토리에서 현재 시점의 값 */
  readonly value: ReadonlyDeep<T>;
  /** 히스토리에 새로운 항목을 추가한다. */
  setValue(newValue: T): void;

  /** 실행 취소 단계가 남아있는지 나타내는 값 */
  readonly canUndo: boolean;
  /** 다시 실행 단계가 남아있는지 나타내는 값 */
  readonly canRedo: boolean;
  /** 실행 취소를 한다. 실행 취소가 불가능하면 아무것도 하지 않는다. */
  undo(): void;
  /** 다시 실행을 한다. 다시 실행이 불가능하면 아무것도 하지 않는다. */
  redo(): void;

  /**
   * 히스토리를 완전히 초기화한다.
   * @param initialValue 새로운 초기값
   */
  reset(initialValue: T): void;
}

/** 실행 취소/다시 실행 기능을 제공하는 간단한 Valtio 저장소를 만든다. */
export function createHistoryStore<T>(initialValue: T): HistoryStore<T> {
  const store = proxy({
    snapshots: [initialValue] as ReadonlyDeep<T>[],

    index_: 0,
    get index() {
      return this.index_;
    },
    set index(newIndex: number) {
      if (!Number.isSafeInteger(newIndex)) {
        throw new Error(`Index must be safe integer, got ${newIndex}`);
      }
      if (!(0 <= newIndex && newIndex < this.snapshots.length)) {
        throw new Error(
          `Index out of bounds: ${newIndex} (${this.snapshots.length} snapshot(s) in history)`
        );
      }
      this.index_ = newIndex;
    },

    get value() {
      return this.snapshots[this.index];
    },
    setValue: (newValue: T) => {
      store.snapshots.splice(
        store.index + 1,
        Number.POSITIVE_INFINITY,
        newValue as ReadonlyDeep<T>
      );
      store.index++;
    },

    get canUndo() {
      return this.index > 0;
    },
    get canRedo() {
      return this.index < this.snapshots.length - 1;
    },
    undo: () => {
      if (store.index > 0) {
        store.index--;
      }
    },
    redo: () => {
      if (store.index < store.snapshots.length - 1) {
        store.index++;
      }
    },

    reset: (initialValue: T) => {
      store.index = 0;
      store.snapshots = [initialValue] as ReadonlyDeep<T>[];
    },
  });

  return store;
}

const store = createHistoryStore({ name: "John", age: 20 });

subscribe(store, () => {
  console.log("Store: %O", {
    snapshots: store.snapshots,
    index: store.index,
    value: store.value,
    canUndo: store.canUndo,
    canRedo: store.canRedo,
  });
});

setTimeout(() => {
  store.setValue({ ...store.value, age: 30 });
  store.setValue({ ...store.value, name: "Mary" });
}, 100);
setTimeout(() => store.undo(), 100);
setTimeout(() => store.redo(), 200);
setTimeout(() => {
  store.index = 0;
}, 300);
setTimeout(() => store.reset({ name: "Tom", age: 10 }), 400);
