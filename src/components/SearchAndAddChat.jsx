import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";
import { userStore } from "../lib/userStore";

function SearchAndAddChat({ setToggle }) {
  const { user } = userStore();
  const [searchUser, setSearchUser] = useState("");
  const [userSearch, setUserSearch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusUserInContact, setstatusUserInContact] = useState(false);

  const checkUser = useCallback(async () => {
    try {
      const docRef = doc(db, "userChat", user.id);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data().chats;
      if (userSearch) {
        const existingUserInContact = docData.findIndex(
          (item) => item.receiverId === userSearch.id
        );

        if (existingUserInContact !== -1) {
          setstatusUserInContact(true);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [user, userSearch]);

  useEffect(() => {
    checkUser();
  }, [userSearch, checkUser]);

  const handleSearchUser = async () => {
    setIsLoading(true);
    setstatusUserInContact(false);
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", searchUser)
      );
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        querySnapShot.forEach(async (res) => {
          const data = res.data();
          if (data.id === user.id) return;
          setUserSearch(res.data());
        });
      } else {
        toast.warn("User not found!");
        setUserSearch(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUserToChat = async () => {
    if (statusUserInContact) return;
    const chatRef = collection(db, "chats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const userIdX = [user.id, userSearch.id];
      userIdX.forEach(async (id) => {
        const docRef = doc(db, "userChat", id);
        await updateDoc(docRef, {
          chats: arrayUnion({
            receiverId: user.id === id ? userSearch.id : user.id,
            lastMessage: "",
            createdAt: Date.now(),
            chatId: newChatRef.id,
          }),
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setToggle(false);
    }
  };
  return (
    <div className="absolute right-1/2 bottom-1/2 translate-x-1/2 bg-slate-400 p-4 rounded-md z-50">
      <div className="flex gap-3">
        <input
          type="text"
          className="text-black px-4 py-2 rounded-md "
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          placeholder="Search user..."
        />
        <button
          className="bg-slate-900 rounded-md p-3 disabled:cursor-not-allowed"
          onClick={handleSearchUser}
          disabled={searchUser.length < 1}
        >
          {isLoading ? "Loading" : "Search"}
        </button>
      </div>

      <div className="flex gap-4 mt-5 px-2 items-center justify-between">
        {userSearch && !isLoading && (
          <>
            <img
              src={userSearch.profilePicUrl || "./avatar.png"}
              alt=""
              className="avatar"
            />
            <p>{userSearch.username}</p>
            <button
              className="bg-slate-900 rounded-md p-3"
              onClick={handleAddUserToChat}
            >
              {statusUserInContact ? "Already exist" : "Add"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchAndAddChat;
