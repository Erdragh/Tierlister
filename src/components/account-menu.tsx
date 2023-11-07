import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import styles from "./account-menu.module.scss";

export default function AccountMenu() {
  return (
    <>
      <Link to="/account" className={styles.accountMenu}>
        Account
        <div className={styles.profile}>
          <FontAwesomeIcon icon={faUser} />
        </div>
      </Link>
    </>
  );
}
