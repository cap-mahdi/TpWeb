import { ChatConversation } from "./ChatConversation";
import { ChatList } from "./ChatList";

export const Chat = () => {
  return (
    <div className="flex flex-rows h-screen">
      <ChatList />
      <ChatConversation />
    </div>
  );
};
