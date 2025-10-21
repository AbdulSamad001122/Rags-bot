import React from "react";
import ChatPage from "../components/AutoExpandInput";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { botName } = useParams();
  console.log(botName);
  return (
    <div>
      <ChatPage botName={botName} />
    </div>
  );
};

export default Chat;
