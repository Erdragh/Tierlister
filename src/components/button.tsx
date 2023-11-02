import { HTMLProps, MouseEvent, useCallback } from "react";
import useHighlight from "../hooks/highlight";
import highlight from "../hooks/highlight.module.scss";
import styles from "./button.module.scss";

export default function Button({
  disablePerspective,
  children,
  className,
  type,
  onMouseMove,
  ...rest
}: {
  disablePerspective?: boolean;
  children?: React.ReactNode;
  className?: string;
} & Omit<HTMLProps<HTMLButtonElement>, "children">) {
  const updateHighlight = useHighlight();
  const mouseMoveHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      updateHighlight(e);
      if (onMouseMove) onMouseMove(e);
    },
    [updateHighlight, onMouseMove]
  );
  return (
    <button
      className={`${styles.button} ${
        !disablePerspective ? highlight.perspectiveContainer : ""
      } ${className ?? ""}`}
      onMouseMove={mouseMoveHandler}
      type={type as "button" | "submit" | "reset" | undefined}
      {...rest}
    >
      <div className={highlight.container}>
        <div className={highlight.highlight} aria-hidden></div>
        <div className={highlight.content}>{children}</div>
      </div>
    </button>
  );
}
