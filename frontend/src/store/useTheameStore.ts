import  { create } from "zustand"

type ThemeType =  {
    theme: string,
    setTheme: (theme: string) => void
}

export const useTheameStore = create<ThemeType>((set)=>({
    theme: localStorage.getItem("theme") || "coffee",
    setTheme: (theme)=>{
        localStorage.setItem("theme", theme)
        set({theme: theme})
    } 
}))