import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const userStore = create((set) => ({
  user: null,
  loading: true,
  changeUser: async (id) => {
    if (!id) return set({ user: null, loading: false });
    try {
      // const docRef = doc(db, "users", id);
      // const docSnap = await getDoc(docRef);
      onSnapshot(doc(db, "users", id), (doc) => {
        set({ user: doc.data(), loading: false });
      });

      // if (docSnap.exists) {
      //   set({ user: docSnap.data(), loading: false });
      // } else {
      //   set({ user: null, loading: false });
      // }
    } catch (error) {
      console.log(error);
      return set({ user: null, loading: false });
    }
  },
}));
