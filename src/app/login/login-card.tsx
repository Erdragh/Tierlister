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
      const data: FormData = new FormData(e.target as HTMLFormElement);
      if (isSignup && data.get("email") !== data.get("verify-email")) {
        return;
      }
      setLoading(true);
      let result = false;
      if (isSignup) {
        result = await userContext.signup(
          data.get("email")! as string,
          data.get("password")! as string,
          data.get("username")! as string
        );
      } else {
        result = await userContext.login(
          data.get("email")! as string,
          data.get("password")! as string
        );
      }
      setLoading(false);
      if (result) navigate("/");
    },
    [userContext.login, setLoading, isSignup]
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
            required
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
                required
              />
            </label>
            <label htmlFor="username">
              Username
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                required
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
            placeholder="Password"
            required
            minLength={8}
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
