import { useState } from "react";
import { userStore } from "../lib/userStore";
import EditProfile from "./EditProfile";
import { auth } from "../lib/firebase";

function UserInfo() {
  const [toggle, setToggle] = useState(false);
  const { user } = userStore();
  return (
    <div className="flex justify-between items-center p-5 border-b border-slate-500">
      <div className="flex gap-2 items-center">
        <img
          src={user.profilePicUrl || "./avatar.png"}
          alt=""
          className="avatar"
        />
        <p className="font-bold text-xl">{user.username}</p>
      </div>

      <div className="flex gap-5 items-center">
        <img
          src="./more.png"
          alt=""
          className="w-5 h-5 cursor-pointer"
          onClick={() => auth.signOut()}
        />
        <img src="./video.png" alt="" className="w-5 h-5 cursor-pointer" />
        <img
          src="./edit.png"
          alt=""
          className="w-5 h-5 cursor-pointer"
          onClick={() => setToggle(!toggle)}
        />
      </div>
      {toggle && <EditProfile setToggle={setToggle} />}
    </div>
  );
}

export default UserInfo;
