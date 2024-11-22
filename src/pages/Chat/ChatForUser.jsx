import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { host } from "../../lib/APIRoutes";
import UserChatContainer from "@/components/Chat/UserChatContainer";
import { useSelector } from "react-redux";

export default function ChatForUser({ tutor }) {
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(undefined);
  const userData = useSelector((store) => store.user.userDatas);
  const [loading, setLoading] = useState(true);
  const socket = useRef();

  console.log("Received tutor data:", tutor);

  useEffect(()=>{
    console.log("Heeeeeeeeeelo")
  })

  useEffect(() => {
    console.log('object :>> ', tutor);
    if (tutor?.name) {
      setCurrentChat({
        name: tutor.name,
        id: tutor._id,
      });
    }
  }, [tutor]);

  useEffect(() => {
    console.log("tutoeeeeeeeeeeeee",tutor)
    socket.current = io(host, { 
      transports: ["websocket"],
      auth:{
        userId:userData._id
      }
    });

    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);
      console.log("Socket :", socket.current);
    });

    socket.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      if (socket.current) {
        console.log("nnnnnnnnn", socket.current.disconnect())
      }
    };
  }, []);

  useEffect(() => {
    if (tutor) {
      setCurrentUser(tutor);
      setLoading(false);
    }
  }, [tutor]);

  useEffect(() => {
    if (currentUser && socket.current) {
      socket.current.emit("add-user", currentUser._id);
      console.log("Emitted add-user with:", currentUser._id);
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
