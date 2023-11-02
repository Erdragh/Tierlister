import { createContext, useCallback, useMemo, useState } from "react";

export type ItemContextType = {
  count: number;
  add: () => void;
  remove: () => void;
};

export const ItemContext = createContext<ItemContextType>({
  count: 0,
  add() {
    this.count++;
  },
  remove() {
    this.count--;
  },
});

export function ItemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);
  const add = useCallback(() => setCount(count + 1), [count, setCount]);
  const remove = useCallback(() => setCount(count - 1), [count, setCount]);
  const value = useMemo(
    () => ({
      count,
      add,
      remove,
    }),
    [count, add, remove]
  );
  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
}
