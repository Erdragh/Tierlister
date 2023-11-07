import { Account, AppwriteException, ID, Models } from "appwrite";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NavigateFunction } from "react-router-dom";
import { AppwriteContext } from "./appwrite-context";

export type UserContextType = {
  loggedIn: boolean;
  username?: string;
  profilePicture?: string;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  requireLogin(
    content: React.ReactNode,
    navigate: NavigateFunction
  ): React.ReactNode;
};

export const UserContext = createContext<UserContextType>({
  loggedIn: false,
  async login() {
    throw new Error("User Context not yet initialized");
  },
  async signup() {
    throw new Error("User Context not yet initialized");
  },
  async logout() {
    throw new Error("User Context not yet initialized");
  },
  requireLogin() {
    throw new Error("User Context not yet initialized");
  },
});

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const appwriteContext = useContext(AppwriteContext);

  const account = useMemo(
    () => new Account(appwriteContext.client),
    [appwriteContext.client]
  );
  const [session, setSession] = useState<Models.Session | null>(null);
  const [prefs, setPrefs] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        setPrefs(await account.get());
        setSession(await account.getSession("current"));
      } catch (e) {
        // 401 means unauthorized and that there is no user currently logged in
        if (e instanceof AppwriteException && e.code !== 401) {
          console.error("Something went wrong: ", e);
        }
      }
    })();
  }, [setPrefs, setSession, account]);

  const login = useCallback(
    async (email: string, password: string) => {
      console.log("logging in", email);
      try {
        setSession(await account.createEmailSession(email, password));
        setPrefs(await account.get());
        return true;
      } catch (e) {
        if (e instanceof AppwriteException) {
          console.warn(e);
        } else {
          console.error(e);
        }
        return false;
      }
    },
    [setPrefs, setSession, account]
  );
  const signup = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        setPrefs(await account.create(ID.unique(), email, password, username));
        setSession(await account.createEmailSession(email, password));
        return true;
      } catch (e) {
        if (e instanceof AppwriteException) {
          console.warn(e);
        } else {
          console.error(e);
        }
        return false;
      }
    },
    [setPrefs, setSession, account]
  );
  const logout = useCallback(async () => {
    try {
      await account.deleteSession("current");
    } catch (e) {
      if (e instanceof AppwriteException) {
        console.warn(e);
      } else {
        console.error(e);
      }
    }
    setSession(null);
    setPrefs(null);
  }, [setPrefs, setSession, account]);

  const requireLogin = useCallback(
    (
      content: React.ReactNode,
      userContext: UserContextType,
      navigate: NavigateFunction
    ) => {
      useEffect(() => {
        if (!userContext.loggedIn) navigate("/signup");
      }, [userContext.loggedIn, navigate]);

      if (!userContext.loggedIn) return <>Requires being logged in.</>;
      return content;
    },
    []
  );

  console.log(prefs);

  const value = useMemo<UserContextType>(() => {
    return {
      loggedIn: !!session,
      username: prefs?.name,
      login,
      signup,
      logout,
      requireLogin(content, navigate) {
        return requireLogin(content, this, navigate);
      },
    };
  }, [session, prefs, login, signup, logout, requireLogin]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
