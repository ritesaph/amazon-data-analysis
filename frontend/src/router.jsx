import { createBrowserRouter } from "react-router";
import DashboardRoute from "./routes/DashboardRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardRoute />,
  },
]);
