import { useContext } from "react";
import Button from "../../components/button";
import { ItemContext } from "../../context/item-context";

import styles from "./control-panel.module.scss";

export default function ControlPanel() {
  const itemContext = useContext(ItemContext);

  return (
    <div className={styles.controlPanel}>
      <span>Current Item Count: {itemContext.count}</span>
      <div className={styles.buttons}>
        <Button onClick={itemContext.add}>Add</Button>
        <Button onClick={itemContext.remove}>Remove</Button>
      </div>
    </div>
  );
}
