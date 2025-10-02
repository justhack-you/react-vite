import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "./utilities/socket";
import NavBar from "./navBar";
import { requestNotificationPermission, subscribeUserToPush } from "./utilities/notifications";
import { MessageCircle } from "lucide-react";
import ChatLoader from "./ChatLoader";

const API_BASE_URL = "http://localhost:5000";

const OpenChat = () => {
  const user = useSelector((store) => store.user.user);
  const token = useSelector((store) => store.user.token);
  const { chatId } = useParams();
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();

  const initializePushNotifications = async () => {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      try {
        const sub = await subscribeUserToPush();
        await axios.post('http://localhost:5000/subscribe', {
          subscription: sub,
          userId: user.id
        }, {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        });
      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
      }
    }
  };
  useEffect(() => {

    initializePushNotifications();

    const fetchChatData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/message/${chatId}`, {
          headers: { token }
        });
        setChatData(response.data);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (chatId && user?.id) fetchChatData();
  }, [chatId, user?.id, token, navigate]);

  useEffect(() => {
    const socket = createSocketConnection();
    socket.emit("joinChat", { sender: user.id, receiver: chatId });
    socket.on("receiveMessage", ({ sender, content }) => {
      setChatData((prev) => [...prev, { sender, content, timestamp: Date.now() }]);

    });
    socket.emit('markAsRead', { senderId: user.id, receiverId: chatId });
    return () => socket.close();
  }, [user?.id, chatId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  if (loading) {
    return <ChatLoader />;
  }

  return (
    <>
      <NavBar chat={chatId} />
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ scrollBehavior: "smooth" }}>
        {chatData.length ? chatData.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender !== chatId ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words ${msg.sender !== chatId
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
              }`}>
              <div className="text-sm leading-relaxed">{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.sender !== chatId ? "text-blue-100" : "text-gray-500"}`}>
                {msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString()
                  : ""}
              </div>
            </div>
          </div>
        )) : (
          <div className="flex-1 pt-[13%] bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a contact from the sidebar to start messaging</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default OpenChat;
