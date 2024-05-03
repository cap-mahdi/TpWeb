import { useState } from "react";
import { HeartsPopup } from "./HeartsPopup";

export const ChatMessageReceive = ({
  messageId,
  text,
  image,
  onToggleHeart,
  hearts,
}: {
  messageId: string;
  text: string;
  image?: string;
  onToggleHeart: (messageId: string) => void;
  hearts: string[];
}) => {
  const [open, setOpen] = useState(false);

  const handleShowHeart = () => {
    onToggleHeart(messageId);
  };

  return (
    <>
      <div className="chat-message" onDoubleClick={handleShowHeart}>
        <div className="flex items-end justify-end">
          <div className="flex flex-col space-y-2 text-lg max-w-lg mx-2 order-1 items-end">
            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
              {text}
            </span>
            {hearts.length > 0 && (
              <span
                className="rounded-full bg-gray-200 p-2 -ml-2"
                style={{
                  // move the heart to the top
                  transform: "translateY(-50%)",
                }}
                onClick={() => {
                  setOpen(true);
                }}
              >
                ❤️({hearts.length})
              </span>
            )}
          </div>
          <img
            src={image}
            alt="My profile"
            className="w-10 h-10 rounded-full order-2"
          />
        </div>
      </div>
      <HeartsPopup
        isOpen={open}
        onCloseButtonClick={() => {
          setOpen(false);
        }}
        hearts={hearts}
      />
    </>
  );
};
