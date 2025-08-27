import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export interface ChatUser {
  id: string;
  name: string;
  profilePic: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  image?: string;
}

type ChatStoreState = {
    messages: Message[];
    users: ChatUser[];
    selectedUser: ChatUser | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    setSelectedUser: (user: ChatUser | null) => void;
    getMessages: (userId: string) => Promise<void>;
};

export const useChatStore = create<ChatStoreState>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            console.log("API Response:", res.data);
            set({ users: res.data.users || [] });
        } catch (e) {
            console.log("Error from FE useChatStore ", e);
            toast.error("Unable to load the users");
        } finally {
            setTimeout(()=>{
                set({ isUsersLoading: false });
            }, 2000)
        }
    },

    setSelectedUser: (user: ChatUser | null) => {
        set({ selectedUser: user });
        if (user) {
            get().getMessages(user.id);
        } else {
            set({ messages: [] });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log("Messages Response:", res.data);
            set({ messages: res.data.messages || [] });
        } catch (e) {
            console.log("Error getting messages:", e);
            toast.error("Unable to load messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    }
}));