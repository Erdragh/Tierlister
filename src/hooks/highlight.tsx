import { MouseEvent, useCallback } from "react";

function clamp(it: number, from: number, to: number): number {
  return Math.min(Math.max(it, from), to);
}

export default function useHighlight<T extends HTMLElement>() {
  const updateHighlight = useCallback((e: MouseEvent<T>) => {
    const elementPos = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--highlight-x",
      `${clamp((e.clientX - elementPos.left) / elementPos.width, 0, 1)}`
    );
    e.currentTarget.style.setProperty(
      "--highlight-y",
      `${clamp((e.clientY - elementPos.top) / elementPos.height, 0, 1)}`
    );
    e.currentTarget.style.setProperty("--highlight-w", `${elementPos.width}`);
    e.currentTarget.style.setProperty("--highlight-h", `${elementPos.height}`);
  }, []);

  return updateHighlight;
}
