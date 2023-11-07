import LoginCard from "./login-card";

import styles from "./page.module.scss";

export default function LoginPage({ signup }: { signup: boolean }) {
  return (
    <div className={styles.accountPage}>
      <LoginCard signup={signup} route={true} />
    </div>
  );
}
