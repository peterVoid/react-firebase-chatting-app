import { useEffect, useState } from "react";
import { BiPlusCircle } from "react-icons/bi";
import SearchAndAddChat from "./SearchAndAddChat";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { userStore } from "../lib/userStore";
import { useChatStore } from "../lib/chatStore";

function ChatList() {
  const { user } = userStore();
  const { changeChat } = useChatStore();
  const [toggle, setToggle] = useState(false);
  const [listContact, setLisContact] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userChat", user.id), async (res) => {
      const itemData = res.data().chats;
      const promises = itemData.map(async (item) => {
        const docRef = doc(db, "users", item.receiverId);
        const docSnap = await getDoc(docRef);
        const dataDoc = docSnap.data();
        return { ...item, user: dataDoc };
      });
      const chatData = await Promise.all(promises);
      setLisContact(chatData.sort((a, b) => b.createdAt - a.createdAt));
    });
    return () => {
      unSub();
    };
  }, [user.id]);

  const handleChangeChat = async (chatId, userItem) => {
    try {
      const docRef = doc(db, "userChat", user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        const existingChatId = docData.chats.findIndex(
          (i) => i.chatId === chatId
        );
        docData.chats[existingChatId].seenBy = true;

        await updateDoc(docRef, docData);
      }

      changeChat(chatId, userItem);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center gap-6">
        <input
          type="text"
          className="flex-1 outline-none border-none px-4 py-2 bg-slate-800 rounded-md text-sm"
          placeholder="Search for users..."
        />
        <button onClick={() => setToggle(!toggle)}>
          <BiPlusCircle size={30} />
        </button>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {listContact.map((item) => (
          <div
            className={`flex gap-3 items-center cursor-pointer hover:bg-slate-800 rounded-md p-2 transition ease-linear duration-150 ${
              item.seenBy === false ? "bg-blue-900" : null
            }`}
            key={item}
            onClick={() => handleChangeChat(item.chatId, item.user)}
          >
            <img
              src={item.user.profilePicUrl || "./avatar.png"}
              alt=""
              className="avatar"
            />
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-md">{item.user?.username}</h1>
              <p className="text-sm font-medium">{item.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
      {toggle && <SearchAndAddChat setToggle={setToggle} />}
    </div>
  );
}

export default ChatList;
