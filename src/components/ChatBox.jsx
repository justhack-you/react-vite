import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "./utilities/socket";

const ChatBox = () => {
  const { chatId } = useParams();
  const user = useSelector((store) => store.user.user);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (message.trim()) {
      const socket = createSocketConnection();
      socket.emit("sendMessage", { name: user.username, sender: user.id, receiver: chatId, content: message });
      setMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full bg-base-200 p-3 border-t border-base-300">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          className="input input-bordered w-full rounded-2xl"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="btn btn-primary rounded-2xl" disabled={!message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;

