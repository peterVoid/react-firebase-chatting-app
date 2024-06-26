import { useState } from "react";
import { userStore } from "../lib/userStore";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import upload from "../lib/upload";

function EditProfile({ setToggle }) {
  const { user } = userStore();
  const [username, setUsername] = useState(user.username);
  const [isLoading, setIsLoading] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState({
    file: null,
    url: "",
  });

  const handleChangeImage = (e) => {
    setNewProfilePic({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const docRef = doc(db, "users", user.id);

    try {
      if (newProfilePic.file) {
        const newFileImage = await upload(newProfilePic.file);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          data.profilePicUrl = newFileImage;
          data.username = username;
          await updateDoc(docRef, data);
          toast.success("Profile successfully updated❤️🛒🫂");
          setToggle(false);
        }
      } else {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, {
            username,
          });
        }
        toast.success("Profile successfully updated❤️🛒🫂");
        setToggle(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute right-1/2 bottom-1/2 translate-x-1/2 bg-slate-400 p-4 rounded-md z-50">
      <form className="flex gap-3 flex-col" onSubmit={handleEditProfile}>
        <div className="flex gap-3">
          <img
            src={newProfilePic.url || user.profilePicUrl || "./avatar.png"}
            alt=""
            className="avatar"
          />
          <input type="file" accept="image/*" onChange={handleChangeImage} />
        </div>
        <input
          type="text"
          className="text-black px-4 py-2 rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button disabled={isLoading} className="disabled:cursor-not-allowed">
          {isLoading ? "Loading..." : "Edit Profile"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
