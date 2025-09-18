import OpenChat from "./OpenChat";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { chatList } from "./AppStores/userSlice";

const Drawer = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    const getChat = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/user/feed/${user.username}`, {
          headers: { token }
        });
        setChats(data);
        dispatch(chatList({ chatList: data }));
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };
    getChat();
  }, [token, dispatch, navigate]);

  return (
    <div>
      <div className="drawer">
        <input id="chat-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col h-screen max-h-screen bg-gray-50">
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
              {Array.isArray(chats) && chats.map((chat) => (
                <li key={chat._id} className="mb-2">
                  <Link
                    className="flex items-center p-2 rounded-lg hover:bg-base-300"
                    to={`/chat/${chat._id}`}
                    onClick={() => { document.getElementById('chat-drawer').checked = false; }}
                  >
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10 ">
                      <img src={user.avatar} alt="Avatar" />
                    </div>
                    <span className="ml-3">{chat.username}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
