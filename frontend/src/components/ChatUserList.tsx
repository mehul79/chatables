import React from "react";

export interface ChatUser {
  id: string;
  name: string;
  profilePic: string;
  lastMessage: string;
  lastMessageSent: boolean; // true if sent by our user, false if received
  online: boolean,
}

interface ChatUserListProps {
  users: ChatUser[];
}

const ChatUserList: React.FC<ChatUserListProps> = ({ users }) => {
  return (
    <div className="w-full">
      {users.map((user, idx) => (
        <React.Fragment key={user.id}>
          <div
            className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-base-200 ${
              user.lastMessageSent ? "bg-base-100" : "bg-base-300/40"
            }`}
          >
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-base-300"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base-content truncate">
                {user.name}
              </div>
              <div
                className={`text-sm truncate ${
                  user.lastMessageSent
                    ? "text-base-content/70"
                    : "text-base-content/90 font-medium"
                }`}
              >
                {user.lastMessage}
              </div>
            </div>
          </div>
          {idx !== users.length - 1 && (
            <div className="border-b border-base-300 mx-4" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ChatUserList;
