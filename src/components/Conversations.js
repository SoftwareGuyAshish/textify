import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Input from "./Input";
import Messages from "./Messages";

const Conversations = () => {
  const { data } = useContext(ChatContext);

  return data.chatId !== "null" ? (
    <div className="conversations">
      <div className="banner">
        <div className="senderInfo">
          <img src={data.user.photoURL} alt="" />
          <span>{data.user.displayName}</span>
        </div>
      </div>
      <div className="messages">
        <Messages />
      </div>
      <div>
        <Input />
      </div>
    </div>
  ) : (
    <div className="conversations">
      <p className="startupMessage">Choose a user to start conversation.</p>
    </div>
  );
};

export default Conversations;
