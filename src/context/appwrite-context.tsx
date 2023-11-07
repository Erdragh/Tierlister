import { Client } from "appwrite";
import React, { createContext, useMemo } from "react";

export type AppwriteContextType = {
  client: Client;
};

export const AppwriteContext = createContext<AppwriteContextType>({
  get client(): Client {
    throw new Error(`Appwrite Context not yet initialized`);
  },
});

export function AppwriteContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useMemo(() => {
    const c = new Client();
    console.log("endpoint", import.meta.env);
    c.setEndpoint(import.meta.env.VITE_API_ENDPOINT);
    c.setProject(import.meta.env.VITE_PROJECT_ID);
    return c;
  }, []);
  return (
    <AppwriteContext.Provider value={{ client }}>
      {children}
    </AppwriteContext.Provider>
  );
}
