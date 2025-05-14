import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useChatStore = ((set)=>({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    setSelectedUser: false,

    getUsers: async()=>{
        set({isUsersLoading: true})
        try{
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data})
        }catch(e){ 
            console.log("Error from FE useChatStore ", e);
            toast.error("Unable to load the users")
        }finally{
            set({isUsersLoading: false})
        }
    }


}));