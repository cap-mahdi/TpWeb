import { createContext, useState } from "react";
import { IUser } from "../interface";

interface ChatContextInterface {
  currentFriend: IUser | null;
  setCurrentFriend: (friend: IUser) => void;
}

export const chatContext = createContext<ChatContextInterface>({
  currentFriend: null,
  setCurrentFriend: () => {},
});

interface WebsocketProviderProps {
  children: React.ReactNode;
}

export const ChatProvider = ({ children }: WebsocketProviderProps) => {
  const [currentFriend, setCurrentFriend] = useState<IUser | null>(null);
  return (
    <chatContext.Provider value={{ currentFriend, setCurrentFriend }}>
      {children}
    </chatContext.Provider>
  );
};
