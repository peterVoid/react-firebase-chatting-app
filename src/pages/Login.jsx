import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import upload from "../lib/upload";

function Login() {
  const [profilePhoto, setProfilePhoto] = useState({
    file: null,
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    if (!username || !email || !password) {
      return toast.warn("Please fill all fields!");
    }
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const image = await upload(profilePhoto.file);
        const newUser = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (newUser) {
          await setDoc(doc(db, "users", newUser.user.uid), {
            id: newUser.user.uid,
            username,
            email,
            password,
            profilePicUrl: image,
          });

          await setDoc(doc(db, "userChat", newUser.user.uid), {
            chats: [],
          });
        }
        toast.success("Account created!");
      } else {
        toast.warn("Username already exist");
      }
    } catch (error) {
      console.log(error);
      toast.error("This email already in use!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      toast.error("Email or password is wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAvatar = (e) => {
    setProfilePhoto({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  return (
    <div className="h-[80vh] w-[80vw] bg-slate-800  rounded-md shadow-md flex">
      <div className="flex-1 flex justify-center items-center flex-col gap-4">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-white">Login</h1>
          <p className="text-md text-slate-400">Enter to chat app</p>
        </div>
        <form className="space-y-3" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold text-sm">
              email
            </label>
            <input
              type="email"
              required
              id="email"
              name="email"
              autoComplete="off"
              className="bg-slate-200 border-none outline-none px-5 py-2 rounded-md text-md text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold text-sm">
              password
            </label>
            <input
              type="password"
              required
              id="password"
              name="password"
              className="bg-slate-200 border-none outline-none px-5 py-2 rounded-md text-md text-black"
            />
          </div>
          <button className="w-full bg-slate-600/30 px-3 py-2 rounded-md text-md font-semibold text-white shadow-sm">
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>

      <div className="w-1 h-full bg-slate-200" />
      <div className="flex-1 flex justify-center items-center flex-col gap-4">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-white">Register</h1>
          <p className="text-md text-slate-400">
            Come on register first before enter the app
          </p>
        </div>
        <form className="space-y-3" onSubmit={handleRegister}>
          <div className="flex gap-2 items-center">
            <img
              src={`${profilePhoto.url || "./avatar.png"}`}
              alt=""
              className="avatar"
            />
            <label htmlFor="image" className="cursor-pointer">
              Upload an image
            </label>
            <input
              type="file"
              accept="image/*"
              id="image"
              style={{ display: "none" }}
              onChange={handleChangeAvatar}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="font-semibold text-sm">
              username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="off"
              className="bg-slate-200 border-none outline-none px-5 py-2 rounded-md text-md text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold text-sm">
              email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              className="bg-slate-200 border-none outline-none px-5 py-2 rounded-md text-md text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold text-sm">
              password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="bg-slate-200 border-none outline-none px-5 py-2 rounded-md text-md text-black"
            />
          </div>
          <button className="w-full bg-slate-600/30 px-3 py-2 rounded-md text-md font-semibold text-white shadow-sm">
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
