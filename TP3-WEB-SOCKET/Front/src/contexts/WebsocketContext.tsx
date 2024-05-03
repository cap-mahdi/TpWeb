import { createContext } from "react";
import { Socket, io } from "socket.io-client";

export const socket = io("http://localhost:3000");
export const WebsocketContext = createContext<Socket>(socket);
// export const WebsocketProvider = WebsocketContext.Provider;

interface WebsocketProviderProps {
  children: React.ReactNode;
}

export const WebsocketProvider = ({ children }: WebsocketProviderProps) => {
  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
};
