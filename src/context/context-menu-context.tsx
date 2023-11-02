import { createContext, useCallback, useMemo, useRef, useState } from "react";

import styles from "./context-menu-context.module.scss";

import Button from "../components/button";

export type ContextMenuAction = {
  label: string;
  action: () => void;
};

export type ContextMenuContextType = {
  open: (actions: ContextMenuAction[], x?: number, y?: number) => void;
  close: () => void;
};

export const ContextMenuContext = createContext<ContextMenuContextType>({
  open: () => {},
  close: () => {},
});

export function ContextMenuContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [actions, setActions] = useState<ContextMenuAction[] | undefined>(
    undefined
  );
  const [[xPos, yPos], setPos] = useState<[number, number]>([0, 0]);

  const bodyListener = useRef<((e: MouseEvent) => void) | undefined>(undefined);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const close = useCallback(() => {
    setActions(undefined);
    if (bodyListener.current)
      document.body.removeEventListener("click", bodyListener.current);
  }, [setActions, bodyListener]);
  const open = useCallback(
    (actions: ContextMenuAction[], x?: number, y?: number) => {
      console.log(actions);
      setActions(actions);
      setPos([x ?? xPos, y ?? yPos]);
      if (bodyListener.current)
        document.body.removeEventListener("click", bodyListener.current);
      bodyListener.current = (e) => {
        if (!dialogRef.current?.contains(e.target as HTMLElement)) {
          close();
        }
      };
      document.body.addEventListener("click", bodyListener.current);
    },
    [setActions, setPos, close, dialogRef]
  );

  const value = useMemo(
    () => ({
      open,
      close,
    }),
    [open, close]
  );

  const dialogPosStyle = useMemo(() => {
    return Object.fromEntries([
      ["--context-x", `${xPos}px`],
      ["--context-y", `${yPos}px`],
    ]);
  }, [xPos, yPos]);

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
      {actions && (
        <dialog
          ref={dialogRef}
          className={`${styles.contextMenu}`}
          style={dialogPosStyle}
          open
        >
          {actions.map(({ label, action }) => (
            <Button
              disablePerspective={true}
              key={label}
              onClick={() => {
                action();
                close();
              }}
            >
              {label}
            </Button>
          ))}
        </dialog>
      )}
    </ContextMenuContext.Provider>
  );
}
