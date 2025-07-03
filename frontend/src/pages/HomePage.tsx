import ChatUserList, { ChatUser } from "../components/ChatUserList";
import { Search, Smile, Paperclip, Send } from "lucide-react";
import SidebarSkeleton from "../components/Skeletons/SidebarSkeleton";
import MessageSkeleton from "../components/Skeletons/MessageSkeleton";
import { useEffect, useState, useRef } from "react";
import Picker from "@emoji-mart/react";
import { FlickeringGrid } from "../components/FlickeringGrid";
import ChatBox from "../components/ChatBox";

const dummyUsers: ChatUser[] = [
  {
    id: "1",
    name: "Alice Johnson",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
    lastMessage: "See you at 8!",
    lastMessageSent: true,
    online: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
    lastMessage: "Got it, thanks!",
    lastMessageSent: false,
    online: false,
  },
  {
    id: "3",
    name: "Charlie Lee",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
    lastMessage: "Let's catch up soon.",
    lastMessageSent: true,
    online: true,
  },
  {
    id: "4",
    name: "Diana Prince",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
    lastMessage: "I'll send the files tomorrow.",
    lastMessageSent: false,
    online: false,
  },
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate loading from backend
    const timeout = setTimeout(() => {
      setUsers(dummyUsers);
      setSelectedUser(dummyUsers[0]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const handleEmojiSelect = (emoji: { native?: string }) => {
    setMessage((prev) => prev + (emoji.native || ""));
  };

  return (
    <div className="h-screen overflow-hidden ">
      <div className="flex items-center justify-center h-full w-full pt-17">
        <div className="w-[89vw] h-[87vh] bg-base-100 rounded-2xl shadow-2xl border border-base-300 flex items-center justify-center">
          {/* Sidebar */}
          <div className="flex h-full w-full">
            <div className="w-1/4 h-full overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Search Box or Skeleton */}
                {loading ? (
                  <SidebarSkeleton />
                ) : (
                  <>
                    <div className="px-4 pt-4 pb-2">
                      <label className="input input-bordered flex items-center gap-2 bg-base-200 focus-within:bg-base-100 rounded-lg">
                        <Search className="w-4 h-4 text-base-content/70" />
                        <input
                          type="text"
                          className="grow bg-transparent outline-none"
                          placeholder="Search users..."
                        />
                      </label>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <ChatUserList users={users} />
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Vertical Divider */}
            <div className="w-px h-full bg-base-300 mx-0" />
            {/* Chat Window */}
            <div className="flex-1 h-full flex flex-col rounded-r-2xl overflow-hidden">
              {/* Top NavBar of Chat Window */}
              {!loading && (
                <div className="h-20 px-8 flex items-center gap-4 border-b border-base-300 bg-base-100/80 rounded-tr-2xl">
                  <div className="relative">
                    <img
                      src={selectedUser?.profilePic}
                      alt={selectedUser?.name}
                      className="w-12 h-12 rounded-full object-cover border border-base-300"
                    />
                    <span
                      className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-base-100 animate-pulse ${
                        selectedUser?.online ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-base-content">
                      {selectedUser?.name}
                    </div>
                  </div>
                </div>
              )}
              {/* Chat Messages or Skeleton */}
              <div className="flex-1 overflow-hidden">
                {loading ? (
                  <MessageSkeleton />
                ) : (
                  <div
                    className="flex flex-col gap-1 overflow-x-hidden relative flex-1 overflow-y-auto p-5  bg-base-100"
                    style={{ scrollbarWidth: "thin" }}
                  >
                  <div className="absolute inset-0 z-0 w-full h-screen overflow-hidden">
                      <FlickeringGrid width={1000} maxOpacity={0.07} />
                  </div>
                    {/* Example chat messages (duplicated) */}
                    {(() => {
                      // Example messages array
                      const messages = [
                        {
                          message: "Hey! How are you?",
                          time: "10:45 AM",
                          sent: false,
                        },
                        {
                          message: "I'm good, thanks! How about you?",
                          time: "10:46 AM",
                          sent: true,
                        },
                        {
                          message: "Doing well! Are we still on for tonight?",
                          time: "10:47 AM",
                          sent: false,
                        },
                        {
                          message: "Absolutely, see you at 8!",
                          time: "10:48 AM",
                          sent: true,
                        },
                        {
                          message: "Great, see you!",
                          time: "10:49 AM",
                          sent: false,
                        },
                        {
                          message: "Looking forward to it!",
                          time: "10:50 AM",
                          sent: true,
                        },
                        {
                          message: "Same here!",
                          time: "10:51 AM",
                          sent: false,
                        },
                        {
                          message: "See you soon!",
                          time: "10:52 AM",
                          sent: true,
                        },
                        {
                          message: "See you soon!",
                          time: "10:52 AM",
                          sent: true,
                        },
                        {
                          message: "Great, see you!",
                          time: "10:49 AM",
                          sent: false,
                        },
                        {
                          message: "Looking forward to it!",
                          time: "10:50 AM",
                          sent: true,
                        },
                        {
                          message: "Same here!",
                          time: "10:51 AM",
                          sent: false,
                        },
                        {
                          message: "See you soon!",
                          time: "10:52 AM",
                          sent: true,
                        },
                        {
                          message: "See you soon!",
                          time: "10:52 AM",
                          sent: true,
                        },
                      ];
                      return messages.map((msg, idx) => {
                        const isLastInGroup =
                          idx === messages.length - 1 ||
                          messages[idx + 1].sent !== msg.sent;
                        return (
                          <ChatBox
                            key={idx}
                            message={msg.message}
                            time={msg.time}
                            sent={msg.sent}
                            showTime={isLastInGroup}
                          />
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
              {/* Chat Input Box */}
              <div className="px-4 py-3 bg-base-200 border-t border-base-300 flex items-center gap-2 sticky ">
                {/* Emoji Picker Button */}
                <button
                  className="btn btn-ghost btn-circle"
                  onClick={() => setShowEmoji((v) => !v)}
                  tabIndex={-1}
                  type="button"
                >
                  <Smile className="w-6 h-6 text-base-content/70" />
                </button>
                {/* Emoji Picker Dropdown */}
                {showEmoji && (
                  <div className="absolute bottom-16 left-0 z-50">
                    <Picker theme="dark" onEmojiSelect={handleEmojiSelect} />
                  </div>
                )}
                {/* Attach Button */}
                <button
                  className="btn btn-ghost btn-circle"
                  tabIndex={-1}
                  type="button"
                >
                  <Paperclip className="w-6 h-6 text-base-content/70" />
                </button>
                {/* Message Input */}
                <input
                  ref={inputRef}
                  type="text"
                  className="input input-bordered flex-1 bg-base-50 focus:bg-base-50 border-none outline-none shadow-none rounded-lg"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {/* Send Button */}
                <button className="btn btn-primary btn-circle" type="button">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
