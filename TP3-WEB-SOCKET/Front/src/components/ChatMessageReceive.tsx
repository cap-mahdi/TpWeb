import { useState } from "react";

export const ChatMessageReceive = ({
  text,
  image,
}: {
  text: string;
  image: string;
}) => {
  const [showHeart, setShowHeart] = useState(false);

  const handleShowHeart = () => {
    setShowHeart((prev) => !prev);
  };

  return (
    <div className="chat-message" onDoubleClick={handleShowHeart}>
      <div className="flex items-end justify-end">
        <div className="flex flex-col space-y-2 text-lg max-w-lg mx-2 order-1 items-end">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
              {text}
            </span>
            {showHeart && (
              <span
                className="rounded-full bg-gray-200
               p-2 -mt-2 -ml-2"
              >
                ❤️
              </span>
            )}
          </div>
        </div>

        <img
          src={image}
          alt="My profile"
          className="w-10 h-10 rounded-full order-2"
        />
      </div>
    </div>
  );
};
