import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";


type AuthStore = {
    authUser: authUser | null,
    isSigningUp: boolean,
    isLogginin: boolean,
    isUpdatingProfile: boolean,
    isUpdatingFullName: boolean,
    isCheckingAuth: boolean,
    checkAuth: () => Promise<void>,
    signup: (formData: any) => Promise<void>
    logout: ()=> Promise<void>,
    isLoggingIn: boolean,
    login: (formData: any)=> Promise<void>,
    updateProfile: (FormData: any, userId: any)=> Promise<void>,
    updateFullName: (fullName: string) => Promise<void>
}

type authUser = {
    id: string,
    name?: string,
    email?: string,
    profilePic?: string,
    createdAt?: string,
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isLogginin: false,
    isUpdatingProfile: false,
    isUpdatingFullName: false,
    isCheckingAuth: true,


    checkAuth: async()=>{
        try{
            const res = await axios.get("http://localhost:3000/api/auth/check", {
                withCredentials: true,
            });
            if(res.status == 200){
                set({authUser: res.data.user})
            }

        }catch(e){
            console.log("Error whiling checking user FE: ", e);
            set({authUser: null})
        }finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async(formData)=>{
        set({isSigningUp: true})
        try{
            const res = await axiosInstance.post("/auth/signup", formData)
            set({authUser: res.data})
            console.log(res);
            toast.success(res.data.message)
        }catch(e: unknown){
            if (axios.isAxiosError(e)) {
                console.log(e.response?.data);
              } else {
                console.log('An unknown error occurred');
              }
        }finally{
            set({isSigningUp: false})
        }
    },

    logout: async()=>{
        try{
            const res = await axiosInstance.post("/auth/logout", {}, {
                withCredentials: true
            })
            set({authUser: null});
            toast.success(res.data.message);
            
        }catch(e){
            if (axios.isAxiosError(e)) {
                console.log(e.response?.data);
              } else {
                console.log('An unknown error occurred');
              }
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully"); 
        } catch (error: any) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      updateProfile: async (formData, userId) => {

        formData.append("userId", userId);
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.post("/auth/update-profile", formData, {
            headers:{
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });
          
          set({ authUser: res.data.user });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      updateFullName: async (fullName: string) => {
        set({ isUpdatingFullName: true });
        try {
          const res = await axiosInstance.put("/auth/update-fullname", 
            { fullName },
            { withCredentials: true }
          );
          
          set({ authUser: res.data.user });
          toast.success("Full name updated successfully");
        } catch (error: any) {
          console.log("error in update full name:", error);
          toast.error(error.response?.data?.message || "Failed to update full name");
        } finally {
          set({ isUpdatingFullName: false });
        }
      },
}));
