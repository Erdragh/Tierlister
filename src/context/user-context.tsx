import { Account, AppwriteException, ID, Models } from "appwrite";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppwriteContext } from "./appwrite-context";

export type UserContextSession = {
  ip: string;
  creationDate: Date;
  client: string;
  id: string;
  current: boolean;
};

export type UserContextType = {
  loggedIn: boolean;
  username?: string;
  email?: string;
  verified?: boolean;
  sessions?: UserContextSession[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  requireLogin(content: React.ReactNode): React.ReactNode;
  requireVerified(content: React.ReactNode): React.ReactNode;
  logoutSession: (id: string) => Promise<void>;
  fetchSessions: () => Promise<void>;
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
  requireVerified() {
    throw new Error("User Context not yet initialized");
  },
  async logoutSession() {
    throw new Error("User Context not yet initialized");
  },
  async fetchSessions() {
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
  const [sessions, setSessions] = useState<UserContextSession[]>([]);

  // TODO: optimize
  const fetchSessions = useCallback(async () => {
    const newSessions: UserContextSession[] = (
      await account.listSessions()
    ).sessions.map((s) => ({
      ip: s.ip,
      creationDate: new Date(s.$createdAt),
      client: `${s.clientName} - ${s.osName}`,
      id: s.$id,
      current: s.$id === session?.$id,
    }));
    setSessions(newSessions);
  }, [session, setSessions, account]);

  const update = useCallback(
    async (
      userPrefs: Models.User<Models.Preferences>,
      session: Models.Session
    ) => {
      setPrefs(userPrefs);
      setSession(session);
    },
    [setPrefs, setSession]
  );

  const previousUpdateMethod = useRef<typeof update | null>(null);

  useEffect(() => {
    (async () => {
      if (previousUpdateMethod.current == update) return;
      previousUpdateMethod.current = update;
      console.log("use effect");
      try {
        await update(await account.get(), await account.getSession("current"));
      } catch (e) {
        // 401 means unauthorized and that there is no user currently logged in
        if (e instanceof AppwriteException && e.code !== 401) {
          console.error("Something went wrong: ", e);
        }
      }
    })();
  }, [update, account]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const s = await account.createEmailSession(email, password);
        await update(await account.get(), s);
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
    [update, account]
  );
  const signup = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        await update(
          await account.create(ID.unique(), email, password, username),
          await account.createEmailSession(email, password)
        );
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
    [update, account]
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
    (content: React.ReactNode, userContext: UserContextType) => {
      if (!userContext.loggedIn) return <>Requires being logged in.</>;
      return content;
    },
    []
  );

  const requireVerified = useCallback(
    (content: React.ReactNode, userContext: UserContextType) => {
      if (!userContext.loggedIn) return requireLogin(content, userContext);
      if (!userContext.verified)
        return <>Requires a verified E-Mail address.</>;
      return content;
    },
    [requireLogin]
  );

  const logoutSession = useCallback(
    async (id: string) => {
      await account.deleteSession(id);
      await fetchSessions();
    },
    [account, update]
  );

  const value = useMemo<UserContextType>(() => {
    return {
      loggedIn: !!session,
      username: prefs?.name,
      email: prefs?.email,
      verified: prefs?.emailVerification,
      sessions,
      login,
      signup,
      logout,
      requireLogin(content) {
        return requireLogin(content, this);
      },
      requireVerified(content) {
        return requireVerified(content, this);
      },
      logoutSession,
      fetchSessions,
    };
  }, [
    session,
    sessions,
    prefs,
    login,
    signup,
    logout,
    requireLogin,
    fetchSessions,
  ]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
