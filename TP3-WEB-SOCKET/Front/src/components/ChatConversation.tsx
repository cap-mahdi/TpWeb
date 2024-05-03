import { ChatMessageReceive } from "./ChatMessageReceive";
import { ChatMessageSend } from "./ChatMessageSend";
import { InputChat } from "./InputChat";
import { NavBar } from "./NavBar";

let Messages = [
  {
    id: 1,
    text: "Your error message says permission denied, npm global installs must be given root privileges.qdfdsiuhsdfiughsidufghsuidfhgiusdhfgiushdfiughsiudfgsdfg qdfsdfqsdfjkhkajezhrkjahezr sdfuhsdiufdfgsdfgsdfg sdfgsdhfjkghsdfjghkjhdkjzherkjthzkjertzer jnsjkdfkjshdfgjkhsdfkghsdlkfg zeruhzeiurhtiuzerhtiui",
    image:
      "https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
  },
  {
    id: 2,
    text: "Can be verified on any platform using docker",
    image:
      "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
  },
  {
    id: 3,
    text: "Can be verified on any platform using docker",
    image:
      "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
  },
  {
    id: 4,
    text: "Can be verified on any platform using docker",
    image:
      "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
  },
  {
    id: 5,
    text: "Can be verified on any platform using docker",
    image:
      "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
  },
  {
    id: 6,
    text: "Can be verified on any platform using docker",
    image:
      "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
  },
  {
    id: 7,
    text: "Can be verified on any platform using docker",
    image:
      "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
  },
  {
    id: 8,
    text: "Can be verified on any platform using docker",
    image:
      "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144",
  },
];

export const ChatConversation = () => {
  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        {Messages.map((message) => (
          <div key={message.id}>
            {message.id % 2 === 0 ? (
              <ChatMessageSend text={message.text} image={message.image} />
            ) : (
              <ChatMessageReceive text={message.text} image={message.image} />
            )}
          </div>
        ))}
      </div>
      <InputChat />
    </div>
  );
};
