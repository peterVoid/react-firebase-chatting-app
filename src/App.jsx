import List from "./pages/List";
import Chat from "./pages/Chat";
import ProfileInfo from "./pages/ProfileInfo";
import Login from "./pages/Login";
import Notifications from "./components/Notifications";
import { useEffect } from "react";
import { auth } from "./lib/firebase";
import { userStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

function App() {
  const { user, loading, changeUser } = userStore();
  const { chat } = useChatStore();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      changeUser(user?.uid);
    });
  }, [changeUser]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-[100vh] flex justify-center items-center bg-[#ADBBDA] text-white">
      {user ? (
        <div className="h-[80vh] w-[80vw] bg-slate-700 rounded-md shadow-md flex overflow-hidden">
          <List />
          {chat && <Chat />}
          {chat && <ProfileInfo />}
        </div>
      ) : (
        <Login />
      )}
      <Notifications />
    </div>
  );
}

export default App;
