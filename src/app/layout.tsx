import { Outlet } from "react-router-dom";
import Header from "../components/header";

import { ContextMenuContextProvider } from "../context/context-menu-context";
import { ItemContextProvider } from "../context/item-context";
import styles from "./layout.module.scss";

export default function MainLayout() {
  return (
    <ContextMenuContextProvider>
      <ItemContextProvider>
        <Header></Header>
        <main className={styles.main}>
          <Outlet></Outlet>
        </main>
      </ItemContextProvider>
    </ContextMenuContextProvider>
  );
}
