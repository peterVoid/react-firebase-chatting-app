import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useChatStore = create((set) => ({
  chat: null,
  currentUser: null,
  changeChat: async (chatId, userInfo) => {
    try {
      const docRef = doc(db, "chats", chatId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        set({ chat: chatId, currentUser: userInfo });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.log(error);
      return set({ chat: null });
    }
  },
}));
