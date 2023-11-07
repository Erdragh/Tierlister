import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { UserContext } from "../context/user-context";
import styles from "./account-menu.module.scss";

export default function AccountMenu() {
  const userContext = useContext(UserContext);
  return (
    <>
      <Link
        to={userContext.loggedIn ? "/account" : "/signup"}
        className={styles.accountMenu}
      >
        {userContext.username ?? "Sign Up"}
        <div className={styles.profile}>
          {userContext.profilePicture ? (
            <img src={userContext.profilePicture} alt="Profile Picture" />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
        </div>
      </Link>
      {userContext.loggedIn && (
        <a className={styles.accountMenu} onClick={userContext.logout}>
          Logout <FontAwesomeIcon icon={faRightFromBracket} />
        </a>
      )}
    </>
  );
}
