import { useContext } from "react";
import Card from "../../components/card";
import LoginCard from "../login/login-card";
import ControlPanel from "./control-panel";

import styles from "./page.module.scss";

import { UserContext } from "../../context/user-context";
import pikachu from "/pictures/pikachu.png?url";

export default function ItemsPage() {
  const userContext = useContext(UserContext);
  return userContext.requireVerified(
    <>
      <ControlPanel />
      <div className={styles.cards}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            className={styles.card}
            key={i}
            title={`Card ${i}`}
            src={pikachu}
          ></Card>
        ))}
      </div>
      <LoginCard></LoginCard>
    </>
  );
}
