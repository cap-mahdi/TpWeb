import { useContext, useEffect, useState } from "react";
import { ChatMessageReceive } from "./ChatMessageReceive";
import { ChatMessageSend } from "./ChatMessageSend";
import { InputChat } from "./InputChat";
import { NavBar } from "./NavBar";
import { WebsocketContext } from "../contexts";

interface MessagePayload {
  id: string;
  text: string;
  userId: string | null;
}

interface IMessage extends MessagePayload {
  hearts: string[];
}

interface HeartPayload {
  messageId: string;
  userId: string;
}

const savedUser = localStorage.getItem("user") as string;
const user = JSON.parse(savedUser);

export const ChatConversation = () => {
  const socket = useContext(WebsocketContext);

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (data: MessagePayload) => {
      console.log("Message received", data);
      setMessages((previousMessages) => [
        ...previousMessages,
        { ...data, hearts: [] },
      ]);
    });

    socket.on("heart", (data: HeartPayload) => {
      console.log("Heart received", data);
      setMessages((previousMessages) =>
        previousMessages.map((message) => {
          if (message.id === data.messageId) {
            if (message.hearts.includes(data.userId)) {
              return {
                ...message,
                hearts: message.hearts.filter(
                  (heartId) => heartId !== data.userId
                ),
              };
            }
            return {
              ...message,
              hearts: [...message.hearts, data.userId],
            };
          }
          return message;
        })
      );
    });

    socket.on("connection-id", (id) => {
      console.log("Connection ID received", id);
    });

    return () => {
      console.log("Disconnecting from server");
      socket.off("connect");
      socket.off("message");
      socket.off("heart");
    };
  }, []);

  const onSendMessage = (message: string) => {
    const messagePayload: MessagePayload = {
      id: Date.now().toString(),
      text: message,
      userId: user.id,
    };
    console.log("Sending message", messagePayload);

    socket.emit("message", messagePayload);
  };

  const onToggleHeart = (messageId: string) => {
    const heartPayload: HeartPayload = {
      messageId,
      userId: user.id!,
    };
    console.log("Sending heart", heartPayload);

    socket.emit("heart", heartPayload);
  };

  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        {messages.map((message) => (
          <div key={message.id}>
            {message.userId !== user.id ? (
              <ChatMessageSend
                messageId={message.id}
                text={message.text}
                onToggleHeart={onToggleHeart}
                hearts={message.hearts}
                // image={message.image}
              />
            ) : (
              <ChatMessageReceive
                messageId={message.id}
                text={message.text}
                onToggleHeart={onToggleHeart}
                hearts={message.hearts}
                //  image={message.image}
              />
            )}
          </div>
        ))}
      </div>
      <InputChat onSendMessage={onSendMessage} />
    </div>
  );
};
