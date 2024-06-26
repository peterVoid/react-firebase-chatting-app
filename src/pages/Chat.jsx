import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { useChatStore } from "../lib/chatStore";
import { db } from "../lib/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { userStore } from "../lib/userStore";
import DateToHours from "../lib/DateToHours";
import upload from "../lib/upload";

function Chat() {
  const { currentUser, chat } = useChatStore();

  const { user } = userStore();
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [message, setMessage] = useState([]);

  const [openEmoji, setOpenEmoji] = useState(false);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chat), (doc) => {
      setMessage(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [chat]);

  const handleSendMessage = async () => {
    if (!image.file) {
      if (!typing) return;
    }
    let imgUrl = null;
    if (image.file) {
      imgUrl = await upload(image.file);
    }
    if (!typing) {
      if (image.file) {
        const chatRef = doc(db, "chats", chat);
        await updateDoc(chatRef, {
          messages: arrayUnion({
            message: "",
            senderId: user.id,
            createdAt: Date.now(),
            ...(imgUrl && { img: imgUrl }),
          }),
        });
        setImage({});
      }
      return;
    }
    try {
      const chatRef = doc(db, "chats", chat);
      await updateDoc(chatRef, {
        messages: arrayUnion({
          message: typing,
          senderId: user.id,
          createdAt: Date.now(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const IdX = [user.id, currentUser.id];
      IdX.forEach(async (i) => {
        const docRef = doc(db, "userChat", i);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dataDoc = docSnap.data();
          const getData = dataDoc.chats.findIndex(
            (item) => item.chatId === chat
          );
          dataDoc.chats[getData].lastMessage = typing;
          dataDoc.chats[getData].createdAt = Date.now();
          dataDoc.chats[getData].seenBy = user.id === i ? true : false;

          await updateDoc(docRef, dataDoc);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTyping("");
      setImage({});
    }
  };

  const handleChangeImage = (e) => {
    setImage({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  const refer = useRef(null);

  useEffect(() => {
    refer.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex-[2] h-full w-full border-r border-l border-slate-500 relative  overflow-scroll">
      {/* Bagian atas yang telah diperbaiki lebarnya */}
      <div className="flex items-center justify-between border-b p-5 border-slate-500 fixed w-[682px] bg-slate-700 z-10">
        <div className="flex gap-3 items-center cursor-pointer">
          <img
            src={currentUser.profilePicUrl || "./avatar.png"}
            alt=""
            className="avatar"
          />
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-lg">{currentUser.username}</h1>
            <p className="text-sm font-medium text-slate-400">
              Morning my sunshine☀️🌄
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <img src="./info.png" alt="" className="w-5 " />
          <img src="./phone.png" alt="" className="w-5 " />
        </div>
      </div>

      <div className="flex flex-col p-5 gap-3 mt-24 pb-10">
        {message.map((item) => (
          <>
            <div
              key={item.createdAt}
              className={`bg-slate-400 w-[300px] p-4 rounded-md flex gap-4 flex-col  ${
                item.senderId === user.id ? "self-end" : "self-start"
              }`}
            >
              {item.img && (
                <img
                  src={item.img}
                  alt=""
                  className="w-[300px] h-[300px] object-cover"
                />
              )}
              {item.senderId !== user.id && (
                <img
                  src={currentUser.profilePicUrl || "./avatar.png"}
                  alt=""
                  className="avatar"
                />
              )}

              <p>{item.message}</p>
            </div>
            <p
              className={`${
                item.senderId === user.id ? "self-end" : "self-start"
              }`}
            >
              {DateToHours(item.createdAt)}
            </p>
          </>
        ))}

        {image.file && (
          <img
            src={image.url}
            alt=""
            className="w-[200px] h-[200px] object-cover -translate-y-20"
          />
        )}
        <div ref={refer}></div>
      </div>

      {/* Bagian bawah untuk input dan emoji picker */}
      <div className="fixed bottom-24 bg-slate-700 w-[680px] p-7 border-t border-slate-500 flex justify-center">
        <div className="flex gap-5 w-full items-center">
          <label htmlFor="image">
            <img
              src="./img.png"
              alt=""
              className="w-5 object-contain cursor-pointer"
            />
          </label>
          <input
            type="file"
            className="hidden"
            id="image"
            accept="image/*"
            onChange={handleChangeImage}
          />
          <img
            src="./mic.png"
            alt=""
            className="w-5 object-contain cursor-pointer"
          />
          <input
            type="text"
            className="flex-1 outline-none border-none px-4 py-2 bg-slate-800 rounded-md text-sm"
            placeholder="type..."
            value={typing}
            onChange={(e) => setTyping(e.target.value)}
          />
          <button onClick={() => setOpenEmoji(!openEmoji)}>
            <img
              src="./emoji.png"
              alt=""
              className="w-5 object-contain cursor-pointer"
            />
          </button>

          <div className="absolute bottom-20 right-10">
            <EmojiPicker
              open={openEmoji}
              onEmojiClick={(e) => setTyping((prev) => prev + e.emoji)}
            />
          </div>

          <button
            className="disabled:cursor-not-allowed"
            onClick={handleSendMessage}
          >
            <BiSend size={25} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
