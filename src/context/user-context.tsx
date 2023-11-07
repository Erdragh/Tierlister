import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NavigateFunction } from "react-router-dom";

export type UserContextType = {
  loggedIn: boolean;
  username?: string;
  profilePicture?: string;
  login: (username: string, password: string) => Promise<boolean>;
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
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined
  );

  const login = useCallback(
    async (username: string, password: string) => {
      setUsername(username);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    },
    [setUsername, setProfilePicture]
  );
  const logout = useCallback(async () => {
    setUsername(undefined);
    setProfilePicture(undefined);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, [setUsername, setProfilePicture]);

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

  const value = useMemo<UserContextType>(() => {
    return {
      loggedIn: !!username,
      profilePicture,
      username,
      login,
      logout,
      requireLogin(content, navigate) {
        return requireLogin(content, this, navigate);
      },
    };
  }, [username, profilePicture, login, requireLogin]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
