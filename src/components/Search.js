import {
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
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  //Selecting the user from the search result
  const handleSelect = async () => {
    //Check whether the conversation between the two users exist or not in the chats group, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        // create chat between two
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //Create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      //Setting the user into the Chat context so that when wwe click on it, his/her chat opens on the right-hand side.
      dispatch({ type: "CHANGE_USER", payload: user });
    } catch (err) {
      setErr(true);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          onKeyDown={handleKey}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="Find a user"
          value={username}
        />
      </div>
      {err && <span>User not found. Note: Usernames are case sensitive.</span>}
      {user && (
        <div className="userInfo" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <span>{user.displayName}</span>
        </div>
      )}
    </div>
  );
};

export default Search;
