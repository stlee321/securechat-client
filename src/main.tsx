import React from "react";
import ReactDOM from "react-dom/client";
import App from "./page/main/App.tsx";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import ChatRoom from "./page/chat/ChatRoom.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Navigate to={"/"} replace={true} />,
  },
  {
    path: "/chat",
    element: <Navigate to={"/"} replace={true} />,
  },
  {
    path: "/chat/:chatId",
    element: <ChatRoom />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
