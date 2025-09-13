import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "./utilities/socket";

const OpenChat = () => {
  const user = useSelector((store) => store.user.user);
  const token = useSelector((store) => store.user.token);
  const { chatId } = useParams();
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newSocket = createSocketConnection();
    newSocket.emit("joinChat", chatData);

    return () => newSocket.close();
  }, [chatData]);


  // Fetch initial chat data
  useEffect(() => {
    const fetchChatData = async () => {
      console.log("Fetching chat data for chatId:", chatId);
      console.log("Current user ID:", user.id);

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/message/${chatId}`, {
          headers: {
            token: token
          }
        });
        setChatData(response.data);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId && user?.id) {
      fetchChatData();
    }
  }, [chatId, user?.id, token]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!chatData) {
    return <div className="p-4">Start a chat</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chatData?.map((msg, idx) => (
          <div key={idx} className={`chat ${msg.sender !== chatId ? "chat-end" : "chat-start"}`}>
            <div className="chat-bubble">
              {msg.content}
              <div className="text-xs opacity-60 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenChat;