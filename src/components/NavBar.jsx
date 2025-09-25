import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const NavBar = ({ chat }) => {
  const chatName = useSelector((store) => store.user.chatList ? store.user.chatList : []);
  const user = useSelector((store) => store.user.user ? store.user.user : []);

  const currentChatUser = useMemo(() => {
    if (chatName && chat) {
      return chatName.find(val => val._id === chat);
    }
    return null;
  }, [chatName, chat]);

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="navbar-start">
        {/* Drawer toggle button */}
        <label htmlFor="chat-drawer" className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
      </div>


      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">
          {currentChatUser ? currentChatUser.username : user.username}
        </a>
      </div>

      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle" onClick={() => {
          localStorage.removeItem('token');
          window.location.reload();
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div >
  );
};

export default NavBar;
