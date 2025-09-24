import OpenChat from "./OpenChat";
import ChatBox from "./ChatBox";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser, chatList } from "./AppStores/userSlice";
import { formatTimestamp, getTokenData } from "./utilities/utilitiesFunction";
import { Search } from "lucide-react";
import { createSocketConnection } from "./utilities/socket";

const Drawer = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [loginDate, setLoginDate] = useState('');

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
    if (user?.lastLogin) {
      setLoginDate(formatTimestamp(user?.lastLogin))
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (!user?.id) return;
    const socket = createSocketConnection();
    socket.emit('drawerList', { loginId: user.id });

    socket.on('updateDrawer', () => {
      socket.emit('drawerList', { loginId: user.id });
    });

    socket.on('chatList', (chat) => {
      setChats(chat);
      dispatch(chatList({ chatList: chat }));
    });
    return () => socket.disconnect();
  }, [user?.id, dispatch]);

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
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-6 mt-8">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">{user.username}</h4>
                    <span className="text-sm text-gray-500">{loginDate}</span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Contacts"
                    className="w-full pl-4 pr-10 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            <ul className="menu p-4 flex-1 text-base-content w-auto">
              {Array.isArray(chats) && chats.map((chat, index) => (
                <li key={chat._id} className="mb-2">
                  <Link
                    className={`flex items-center p-2 rounded-lg hover:bg-base-300 ${selectedUser === chat._id ?
                      'font-semibold text-white bg-gradient-to-tl from-primary to-info px-2 py-1 rounded-md w-auto' : ''}`}
                    to={`/chat/${chat._id}`}
                    onClick={() => {
                      setSelectedUser(chat._id);
                      document.getElementById('chat-drawer').checked = false;
                    }}>
                    <div className="ring-primary-content ring-offset-base-50 w-10 rounded-full ring-1 ring-offset-1 ">
                      <img className="" src={user.avatar} alt="Avatar" />
                    </div>
                    <div className="flex justify-between items-center font-bold flex-1 ml-3">
                      <span>{chat.username.replace(/\b\w/g, letter => letter.toUpperCase())}</span>
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
