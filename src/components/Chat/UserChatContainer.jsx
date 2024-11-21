import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import axiosInstance from "@/AxiosConfig";
import { extractTime } from "@/lib/extractTimeForChat";

export default function UserChatContainer({ currentChat, socket }) {
  const userData = useSelector((store) => store.user.userDatas);

  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return; // Avoid fetching if no currentChat

      try {
        const response = await axiosInstance.get("/message", {
          params: {
            from: userData._id,
            to: currentChat.id,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChat, userData]);

  // Handle sending a message
  const handleSendMsg = useCallback(
    async (msg) => {
      socket.current.emit("send-msg", {
        to: currentChat.id,
        from: userData._id,
        msg,
      });

      try {
        await axiosInstance.post("/message/send", {
          from: userData._id,
          to: currentChat.id,
          message: msg,
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { fromSelf: true, message: msg, createdAt: new Date().toISOString() },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [currentChat?.id, userData._id, socket]
  );


  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log("Message received:", msg);
        setArrivalMessage({
          fromSelf: false,
          message: msg,
          createdAt: new Date().toISOString(), // You could use server's timestamp here
        });
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
      }
    };
  }, [socket]);

  // Update messages with incoming ones
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);

  return (
    <div className="flex flex-col h-full">
      <div className="chat-header bg-white border-b border-gray-200 p-4">
        <div className="user-details flex items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-600 mr-3">
            {currentChat?.name.charAt(0).toUpperCase()}
          </div>
          <div className="username">
            <h3 className="text-lg font-semibold">{currentChat?.name}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            ref={message === messages[messages.length - 1] ? scrollRef : null}
            key={message._id || uuidv4()} // Prefer using _id from backend if available
          >
            <div
              className={`message flex ${
                message.fromSelf || message.senderId === userData._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`content max-w-[70%] p-3 rounded-lg ${
                  message.fromSelf
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{message.message}</p>
                <span className="text-xs opacity-75">
                  {extractTime(message.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
    </div>
  );
}
