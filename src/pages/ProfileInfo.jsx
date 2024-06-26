import { useChatStore } from "../lib/chatStore";

function ProfileInfo() {
  const { currentUser, chat } = useChatStore();
  return (
    <div className="flex-1 p-4">
      <div className="flex flex-col  gap-4 items-center justify-center border-b border-slate-500 py-4">
        <img
          src={currentUser.profilePicUrl}
          alt=""
          className="w-[100px] h-[100px] object-cover rounded-full"
        />
        <h2 className="font-bold text-xl">{currentUser.username}</h2>
        <p> Morning my sunshine☀️🌄</p>
      </div>

      <div className="text-center mt-4">
        <button className="py-2 px-3 rounded-md bg-blue-700 w-full">
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileInfo;
