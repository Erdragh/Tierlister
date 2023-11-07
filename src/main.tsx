import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPage from "./app/main-page.tsx";

import AccountPage from "./app/account/page.tsx";
import ItemsPage from "./app/items/page.tsx";
import MainLayout from "./app/layout.tsx";
import LoginPage from "./app/login/page.tsx";
import { UserContextProvider } from "./context/user-context.tsx";
import "./globals.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/items",
        element: <ItemsPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage signup={false} />,
  },
  {
    path: "/signup",
    element: <LoginPage signup={true} />,
  },
]);

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>
);
