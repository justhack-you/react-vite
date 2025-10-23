import OpenChat from "./OpenChat";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser, chatList } from "./AppStores/userSlice";
import { formatTimestamp, getTokenData } from "./utilities/utilitiesFunction";
import { Search, X } from "lucide-react";
import { createSocketConnection } from "./utilities/socket";
import { API_BASE_URL } from "./utilities/url";

const Drawer = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const chatListData = useSelector((state) => state.user.chatList);
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState([]);
  const [loginDate, setLoginDate] = useState('');
  const [searchItem, setSearchItem] = useState('');

  useEffect(() => {
    const fetchLogin = async () => {
      const token = localStorage.getItem('token');
      const userDetails = await axios.get(`${API_BASE_URL}/user/detail/${getTokenData(token).id}`, {
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
    console.log('socket',socket)
    console.log("user id in drawer",user?.id)
    socket.emit('drawerList', { loginId: user.id });

    socket.on('updateDrawer', () => {
      socket.emit('drawerList', { loginId: user.id });
    });

    socket.on('chatList', (chat) => {
      dispatch(chatList({ chatList: chat }));
    });
    return () => socket.disconnect();
  }, [user?.id, dispatch]);

  const clearSearch = () => {
    setSearchItem('');
  };

  const filteredChats = Array.isArray(chatListData) ? chatListData.filter(chat =>
    chat?.username?.toLowerCase().includes(searchItem.toLowerCase())
  ) : [];

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
                    value={searchItem}
                    placeholder="Search Contacts"
                    className="w-full pl-4 pr-20 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    onChange={(e) => setSearchItem(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    {searchItem && (
                      <button
                        onClick={clearSearch}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title="Clear search"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {searchItem && (
                  <div className="mt-2 text-xs text-gray-500">
                    {filteredChats.length} of {chatListData.length} contacts found
                  </div>
                )}
              </div>
            </div>

            <ul className="menu p-4 flex-1 text-base-content w-auto">
              {searchItem && filteredChats.length === 0 && (
                <li className="text-center py-8">
                  <div className="text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Try a different search term</p>
                  </div>
                </li>
              )}

              {filteredChats.map((chat,) => (
                <li key={chat._id} className="mb-2">
                  <Link
                    className={`flex items-center p-2 rounded-lg hover:bg-base-300 transition-colors ${selectedUser === chat._id ?
                      'font-semibold text-white bg-gradient-to-tl from-primary to-info px-2 py-1 rounded-md w-auto' : ''
                      }`}
                    to={`/chat/${chat._id}`}
                    onClick={() => {
                      setSelectedUser(chat._id);
                      document.getElementById('chat-drawer').checked = false;
                    }}
                  >
                    <div className="ring-primary-content ring-offset-base-50 w-10 rounded-full ring-1 ring-offset-1">
                      <img className="" src={user.avatar} alt="Avatar" />
                    </div>
                    <div className="flex justify-between items-center font-bold flex-1 ml-3">
                      <span>
                        {searchItem ? (
                          <HighlightText
                            text={chat.username.replace(/\b\w/g, letter => letter.toUpperCase())}
                            highlight={searchItem}
                          />
                        ) : (
                          chat.username.replace(/\b\w/g, letter => letter.toUpperCase())
                        )}
                      </span>
                      {chat.unreadCount > 0 && (
                        <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs">
                          {chat.unreadCount}
                        </span>
                      )}
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

const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-200 text-yellow-800 rounded px-1">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default Drawer;