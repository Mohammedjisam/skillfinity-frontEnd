import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { host } from "../../lib/APIRoutes";
import { useSelector } from "react-redux";
import UserChatContainer from "@/components/Chat/UserChatContainer";

export default function ChatForUser({ tutor }) {
  const [currentChat, setCurrentChat] = useState(null);

  console.log("ithaaaaaaa tutor dataaaaaa=>", tutor);

  useEffect(() => {
    if (tutor?.name) {
      setCurrentChat({
        name: tutor.name,
        id: tutor._id,
      });
    }
  }, [tutor]);

  const navigate = useNavigate();
  const socket = useRef();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    if (tutor) {
      setCurrentUser(tutor);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      await getCurrentUser();
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      
    }
  }, [currentUser]);

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)]">
            <div className="w-full h-full">
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
      </div>
    </div>
  );
}
