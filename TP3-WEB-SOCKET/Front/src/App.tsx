import { RouterProvider } from "react-router-dom";
import { router } from "./components";
import { WebsocketProvider } from "./contexts";

function App() {
  return (
    <WebsocketProvider>
      <RouterProvider router={router} />
    </WebsocketProvider>
  );
}

export default App;
