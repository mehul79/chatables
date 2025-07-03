import React from "react";

interface ChatBoxProps {
  message: string;
  time: string; // formatted time string
  sent?: boolean; // true if sent by current user, false if received
  className?: string;
  showTime?: boolean; // optionally show time (for grouping)
}

const ChatBox: React.FC<ChatBoxProps> = ({
  message,
  time,
  sent = false,
  className = "",
  showTime = true,
}) => {
  return (
    <div
      className={`flex ${
        sent ? "justify-end" : "justify-start"
      } w-full mb-1 ${className}`}
    >
      <div
        className={`group relative max-w-[70vw] md:max-w-sm px-2 py-2 rounded-xl shadow border text-xs
          ${
            sent
              ? "bg-primary text-primary-content border-primary/40"
              : "bg-base-200 text-base-content border-base-300"
          }
        `}
      >
        <div className="break-words whitespace-pre-line leading-tight">
          {message}
        </div>
        {showTime && (
          <div
            className={`absolute -bottom-5 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] px-1 py-0.5 rounded bg-base-100/90 ${
              sent ? "text-primary/70" : "text-base-content/60"
            }`}
          >
            {time}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
