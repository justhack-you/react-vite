import OpenChat from "./OpenChat";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, chatList } from "./AppStores/userSlice";
import { getTokenData } from "./utilities/utilitiesFunction";

const Drawer = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogin = async () => {
      const token = localStorage.getItem('token');
      const userDetails = await axios.get(`http://localhost:5000/user/detail/${getTokenData(token).id}`, {
        headers: {
          token: token
        }
      })
      dispatch(loginUser({ user: userDetails.data.user, token: token }))
    }

    fetchLogin()

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
    user && getChat();
  }, [token, dispatch, navigate]);

  return (
    user && <div>
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
              {Array.isArray(chats) && chats.map((chat, index) => (
                <li key={chat._id} className="mb-2">
                  <Link
                    className={`flex items-center p-2 rounded-lg hover:bg-base-300 ${index === 0 ? 'font-semibold text-white bg-gradient-to-tl from-primary to-info px-2 py-1 rounded-md w-auto' : ''}`}
                    to={`/chat/${chat._id}`}
                    onClick={() => { document.getElementById('chat-drawer').checked = false; }}
                  >
                    <div className="ring-primary-content ring-offset-base-50 w-10 rounded-full ring-1 ring-offset-1 ">
                      <img className="" src={user.avatar} alt="Avatar" />
                    </div>
                    <div className="flex justify-between items-center font-bold flex-1 ml-3">
                      <span>{index === 0 ? chat.username.replace(/\b\w/g, letter => letter.toUpperCase()) + (' (You)') : chat.username.replace(/\b\w/g, letter => letter.toUpperCase())}</span>
                      {chat.unreadCount > 0 && <span className="text-red-700">{chat.unreadCount}</span>}
                    </div>
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
