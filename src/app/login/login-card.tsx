import Button from "../../components/button";

import React, {
  FormEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import styles from "./login-card.module.scss";

export default function LoginCard({
  signup,
  route,
}: {
  signup?: boolean;
  route?: boolean;
}) {
  const [isSignup, setSignup] = useState(signup);
  useEffect(() => {
    setSignup(signup);
  }, [signup, setSignup]);

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      await userContext.login("asdf", "asdf");
      setLoading(false);
      navigate("/");
    },
    [userContext.login, setLoading]
  );

  return (
    <dialog className={styles.container} open={route}>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">
          E-Mail
          <input
            type="email"
            name="email"
            id="email"
            placeholder="mail@example.com"
            autoFocus
          />
        </label>
        {isSignup && (
          <>
            <label htmlFor="verify-email">
              Verify E-Mail
              <input
                type="email"
                name="verify-email"
                id="verify-email"
                placeholder="mail@example.com"
              />
            </label>
          </>
        )}
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            id="password"
            placeholder="S3cur3P455w0rd"
          />
        </label>
        <Button>{isSignup ? "Sign Up" : "Login"}</Button>
      </form>
      <div>
        {isSignup ? (
          <>
            Already have an account?{" "}
            <SwitchModeLink
              onSwitch={route ? "/login" : () => setSignup(false)}
            >
              Log in
            </SwitchModeLink>
            .
          </>
        ) : (
          <>
            Don&apos;t have an Account yet?{" "}
            <SwitchModeLink
              onSwitch={route ? "/signup" : () => setSignup(true)}
            >
              Sign up
            </SwitchModeLink>
            .
          </>
        )}
      </div>
      <div className={`${styles.loading} ${loading ? styles.active : ""}`}>
        <div>Loading...</div>
      </div>
    </dialog>
  );
}

function SwitchModeLink({
  children,
  onSwitch,
}: {
  children: React.ReactNode;
  onSwitch: string | (() => void);
}) {
  return typeof onSwitch === "string" ? (
    <Link to={onSwitch}>{children}</Link>
  ) : (
    <a onClick={() => onSwitch()}>{children}</a>
  );
}
