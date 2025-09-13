import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ChatBox = () => {
  const { chatId } = useParams();
  const token = useSelector((store) => store.user.token);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:5000/message', {
        receiver: chatId,
        content: message
      }, {
        headers: {
          token: token
        }
      })

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full bg-base-200 p-3 border-t border-base-300">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          className="input input-bordered w-full rounded-2xl"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary rounded-2xl" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
