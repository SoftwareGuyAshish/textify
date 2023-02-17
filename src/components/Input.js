import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db, storage } from "../firebase";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    //Check whether there is a img or not then update messages array accordingly
    if (img) {
      //
      const storageRef = ref(storage, uuid());
      uploadBytes(storageRef, img).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        });
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Date(),
        }),
      });
    }

    //Updating userChats with the last message and the latest timestamp
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    //Reseting the text box
    setImg(null);
    setText("");
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type Something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="buttons">
        <input
          style={{ display: "none" }}
          type="file"
          id="attachments"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="attachments">
          <ImAttachment size={20} />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
