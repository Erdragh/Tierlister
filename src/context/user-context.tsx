import React, { createContext, useCallback, useMemo, useState } from "react";

export type UserContextType = {
  loggedIn: boolean;
  username?: string;
  profilePicture?: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  loggedIn: false,
  async login() {
    throw new Error("User Context not yet initialized");
  },
  async logout() {
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

  const value = useMemo<UserContextType>(() => {
    return {
      loggedIn: !!username,
      profilePicture,
      username,
      login,
      logout,
    };
  }, [username, profilePicture, login]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
