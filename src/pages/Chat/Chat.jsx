import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { host } from "../../lib/APIRoutes";
import NoConversationFallback from "@/components/Chat/NoConversationFallback";
import Contacts from "@/components/Chat/Contacts";
import ChatContainer from "@/components/Chat/ChatContainer";
import { useSelector } from "react-redux";
import axiosInstance from "@/AxiosConfig";

export default function Chat() {
  const tutorData = useSelector((store) => store.tutor.tutorDatas);

  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [showContacts, setShowContacts] = useState(false);

  const getCurrentUser = async () => {
    if (tutorData) {
      setCurrentUser(tutorData);
    }
  };

  const getContacts = async () => {
    if (!currentUser) return;

    if (currentUser) {
      try {
        const { data } = await axiosInstance(
          `/tutor/getStudents/${currentUser._id}`
        );
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    } else {
      navigate("/setAvatar");
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

    socket.current.on("connect", () => {
      console.log("Connected to server. Socket ID:", socket.current.id);

      // Emit user ID after connection
      socket.current.emit("add-user", currentUser._id);
    });

    socket.current.on("connect_error", (err) => {
      console.error("Error during socket connection:", err);
    });
  }
}, [currentUser]);

  

  useEffect(() => {
    getContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setShowContacts(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold text-gray-700">
        Loading...
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
              <h1 className="text-xl font-semibold">Chat</h1>
              <button
                onClick={() => setShowContacts(!showContacts)}
                className="text-gray-600 hover:text-gray-900"
              >
                {showContacts ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
              <div
                className={`${
                  showContacts ? "block" : "hidden"
                } md:block w-full md:w-1/3 border-r border-gray-200 overflow-y-auto`}
              >
                <Contacts contacts={contacts} changeChat={handleChatChange} />
              </div>
              <div
                className={`${
                  showContacts ? "hidden" : "block"
                } md:block w-full md:w-2/3 overflow-y-auto`}
              >
                {currentChat === undefined ? (
                  <NoConversationFallback />
                ) : (
                  <ChatContainer currentChat={currentChat} socket={socket} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
