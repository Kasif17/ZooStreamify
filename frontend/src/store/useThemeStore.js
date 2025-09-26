import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("Zoostreamy")|| "coffee",
    setTheme : (theme) => {
     localStorage.setItem("Zoostreamy",theme)
     set({theme})
},
}))