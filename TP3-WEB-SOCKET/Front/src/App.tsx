import { RouterProvider } from "react-router-dom";
import { router } from "./components";
import { WebsocketProvider } from "./contexts";
import { ChatProvider } from "./contexts/ChatContext";

function App() {
  return (
    <WebsocketProvider>
      <ChatProvider>
        <RouterProvider router={router} />
      </ChatProvider>
    </WebsocketProvider>
  );
}

export default App;
