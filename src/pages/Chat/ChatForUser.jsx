import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { host } from "../../lib/APIRoutes";
import UserChatContainer from "@/components/Chat/UserChatContainer";
import { useSelector } from "react-redux";
import Sidebar from '../User/Sidebar';
import { Menu, ArrowLeft } from 'lucide-react';

export default function ChatForUser({ tutor }) {
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(undefined);
  const userData = useSelector((store) => store.user.userDatas);
  const [loading, setLoading] = useState(true);
  const socket = useRef();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (tutor?.name) {
      setCurrentChat({
        name: tutor.name,
        id: tutor._id,
      });
    }
  }, [tutor]);

  useEffect(() => {
    socket.current = io(host, { 
      transports: ["websocket"],
      auth: {
        userId: userData._id
      }
    });

    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);
    });

    socket.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userData._id]);

  useEffect(() => {
    if (tutor) {
      setCurrentUser(tutor);
      setLoading(false);
    }
  }, [tutor]);

  useEffect(() => {
    if (currentUser && socket.current) {
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="Courses" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-hidden bg-gray-100">
          <div className="h-full">
            <div className="container mx-auto h-full">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <UserChatContainer currentChat={currentChat} socket={socket} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}