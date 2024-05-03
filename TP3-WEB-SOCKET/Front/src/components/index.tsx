import { createBrowserRouter } from "react-router-dom";
import { Login } from "./Login";
import { Chat } from "./Chat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);
