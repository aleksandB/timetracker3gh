// src/app/router/index.tsx

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { MyTimePage } from "../../pages/MyTimePage";
import { TeamTimePage } from "../../pages/TeamTimePage";
import { DirectoryPage } from "../../pages/DirectoryPage";
import { InitPage } from "../../pages/InitPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MyTimePage /> },
      { path: "my-time", element: <MyTimePage /> },
      { path: "team-time", element: <TeamTimePage /> },
      { path: "directory", element: <DirectoryPage /> },
      { path: "init", element: <InitPage /> },
    ],
  },
]);
