import { Link } from "react-router-dom";
import AccountMenu from "./account-menu";
import styles from "./header.module.scss";

export default function Header() {
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.home}>
        Tierlister
      </Link>

      <nav>
        <Link to="/items">Item Manager</Link>
        <AccountMenu />
      </nav>
    </div>
  );
}
