import ChatUserList, { ChatUser } from "../components/ChatUserList";
import { Search, Smile, Paperclip, Send } from "lucide-react";
import SidebarSkeleton from "../components/Skeletons/SidebarSkeleton";
import MessageSkeleton from "../components/Skeletons/MessageSkeleton";
import { useEffect, useState, useRef } from "react";
import Picker from "@emoji-mart/react";
import ChatBox from "../components/ChatBox";
import { useChatStore } from "../store/useChatStore";
import NoChatSelected from "../components/NoChatSelected";
import { useAuthStore } from "../store/useAuthStore";
import { useSocket } from "../hooks/useSockets";

export default function HomePage() {
  const [showEmoji, setShowEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Deconstruct required methods and state from the store
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    messages, 
    isUsersLoading, 
    isMessagesLoading 
  } = useChatStore();
  
  const { authUser } = useAuthStore();

  const socket = useSocket();
  useEffect(()=>{
    console.log("hehe", socket);
  }, [])

  useEffect(() => {
    console.log("Calling getUsers...");
    getUsers();
  }, []);

  useEffect(() => {
    console.log("Users updated:", users);
    console.log("Users length:", users.length);
    console.log("isUsersLoading:", isUsersLoading);
  }, [users, isUsersLoading]);

  const handleEmojiSelect = (emoji: { native?: string }) => {
    setMessage((prev) => prev + (emoji.native || ""));
  };

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
  };

  const onClickSend = ()=>{

  }
  

  return (
    <div className="h-screen overflow-hidden ">
      <div className="flex items-center justify-center h-full w-full pt-17">
        <div className="w-[89vw] h-[87vh] bg-base-100 rounded-2xl shadow-2xl border border-base-300 flex items-center justify-center">
          {/* Sidebar */}
          <div className="flex h-full w-full">
            <div className="w-1/4 h-full overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Search Box or Skeleton */}
                {isUsersLoading ? (
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
                      <ChatUserList 
                        users={users} 
                        selectedUser={selectedUser}
                        onUserSelect={handleUserSelect}
                      />
                      {users.length === 0 && (
                        <div className="text-center text-base-content/70">
                          No users found
                        </div>
                      )}
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
              {selectedUser && !isMessagesLoading && (
                <div className="h-20 px-8 flex items-center gap-4 border-b border-base-300 bg-base-100/80 rounded-tr-2xl">
                  <div className="relative">
                    <img
                      src={selectedUser.profilePic}
                      alt={selectedUser.name}
                      className="w-12 h-12 rounded-full object-cover border border-base-300"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-base-content">
                      {selectedUser.name}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Chat Messages or Skeleton or No Chat Selected */}
              <div className="flex-1 overflow-hidden">
                {!selectedUser ? (
                  <div className="h-full flex justify-center items-center">
                    <NoChatSelected />
                  </div>
                ) : isMessagesLoading ? (
                  <MessageSkeleton />
                ) : (
                  <div className="overflow-x-hidden flex-1 overflow-y-auto bg-base-100 h-full relative">
                      {/* Messages */}
                      <div className="h-full">
                      <div className="relative z-10 p-3">
                        {messages.length > 0 ? (
                          messages.map((msg, idx) => {
                            const isLastInGroup =
                              idx === messages.length - 1 || messages[idx + 1].senderId !== msg.senderId;
                            return (
                              <ChatBox
                                key={msg.id}
                                message={msg.text}
                                time={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                sent={msg.senderId === authUser?.id}
                                showTime={isLastInGroup}
                              />
                            );
                          })
                        ) : (
                          <div className="text-center text-base-content/60 py-8">
                            No messages yet. Start the conversation!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Box - Only show when a user is selected */}
              {selectedUser && (
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
                  <button className="btn btn-primary btn-circle" type="button" onClick={onClickSend}>
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
