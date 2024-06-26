import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatting-app-10b30.firebaseapp.com",
  projectId: "chatting-app-10b30",
  storageBucket: "chatting-app-10b30.appspot.com",
  messagingSenderId: "550869205146",
  appId: "1:550869205146:web:02c238aa24d11c242edf23",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
