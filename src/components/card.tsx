import useHighlight from "../hooks/highlight";

import { HTMLProps, MouseEvent, useCallback, useContext } from "react";
import { ContextMenuContext } from "../context/context-menu-context";
import highlight from "../hooks/highlight.module.scss";
import styles from "./card.module.scss";

export default function Card({
  title,
  src,
  className,
}: {
  title: string;
  src: HTMLProps<HTMLImageElement>["src"];
  className?: string;
}) {
  const updateHighlight = useHighlight();
  const contextMenuContext = useContext(ContextMenuContext);

  const testAction = useCallback(() => {
    console.log("Hello There");
  }, []);

  const contextMenuHandler = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      contextMenuContext.open(
        [
          {
            action: testAction,
            label: "Test",
          },
          {
            action: testAction,
            label: "Test 2",
          },
          {
            action: testAction,
            label: "Longer Name for Testing",
          },
        ],
        e.pageX,
        e.pageY
      );
    },
    [contextMenuContext.open, testAction]
  );

  return (
    <button
      onContextMenu={contextMenuHandler}
      onMouseMove={updateHighlight}
      className={`${highlight.perspectiveContainer} ${styles.card} ${
        className ?? ""
      }`}
    >
      <div className={highlight.container}>
        <div className={highlight.content}>
          <div className={styles.imageContainer}>
            <img src={src} alt={title} className={styles.image} />
          </div>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={highlight.highlight}></div>
      </div>
    </button>
  );
}
