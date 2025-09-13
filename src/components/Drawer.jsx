import NavBar from "./navBar";
import OpenChat from "./OpenChat";
import ChatBox from "./ChatBox";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Drawer = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const [chats, setChat] = useState("")

  const getChat = async () => {
    try {
      const chatData = await axios.get('http://localhost:5000/user/feed', {
        headers: {
          token: token
        }
      });
      setChat(chatData.data)
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }

  };

  return (
    <div>
      <div className="drawer">
        <input id="chat-drawer" type="checkbox" className="drawer-toggle" onClick={getChat} />
        <div className="drawer-content flex flex-col min-h-screen">
          <NavBar />

          <OpenChat />

          <ChatBox />
        </div>
        <div className="drawer-side">
          <label htmlFor="chat-drawer" className="drawer-overlay"></label>
          <div className="w-64 min-h-full bg-base-200 flex flex-col">
            <div className="p-4 border-b border-base-300">
              <h2 className="text-lg font-bold text-center">Chat</h2>
            </div>

            <ul className="menu p-4 flex-1 text-base-content w-auto">
              {chats && chats.map((chat) => (
                <li key={chat._id} className="mb-2">
                  <Link className="flex items-center p-2 rounded-lg hover:bg-base-300" to={`/chat/${chat._id}`}
                    onClick={() => { document.getElementById('chat-drawer').checked = false; }}>
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10 ">
                      <img src={user.avatar} alt="Avatar" />
                    </div>
                    <span className="ml-3">{chat.username}</span>
                  </Link>
                </li>
              ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
