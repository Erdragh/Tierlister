import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPage from "./app/main-page.tsx";

import ItemsPage from "./app/items/page.tsx";
import MainLayout from "./app/layout.tsx";
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
    ],
  },
]);

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
