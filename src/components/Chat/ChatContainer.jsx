import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import axiosInstance from "@/AxiosConfig";
import { extractTime } from "@/lib/extractTimeForChat";

export default function ChatContainer({ currentChat, socket }) {
  const tutorData = useSelector((store) => store.tutor.tutorDatas);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const chatContainerRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;

      try {
        const response = await axiosInstance.get("/message", {
          params: {
            from: tutorData._id,
            to: currentChat.id,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChat, tutorData]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg,
          createdAt: new Date().toISOString(),
        });
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);

  const handleSendMsg = useCallback(
    async (msg) => {
      socket.current.emit("send-msg", {
        to: currentChat.id,
        from: tutorData._id,
        msg,
      });

      try {
        await axiosInstance.post("/message/send", {
          from: tutorData._id,
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
    [currentChat?.id, tutorData._id, socket]
  );

  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isNearBottom) {
      const chatContainer = chatContainerRef.current;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight 
      }
    }
  }, [messages, isNearBottom]);

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5]">
      <div className="chat-header bg-[#f0f2f5] border-b border-gray-200 p-4">
        <div className="user-details flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 mr-3">
            {currentChat?.name.charAt(0).toUpperCase()}
            
          </div>
          <div className="username">
            <h3 className="text-base font-medium text-gray-800">{currentChat?.name}</h3>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="chat-messages flex-grow overflow-y-auto p-4 space-y-2 bg-pink-100 bg-opacity-30"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        {messages.map((message) => (
          <div
            ref={message === messages[messages.length - 1] ? scrollRef : null}
            key={message._id || uuidv4()}
          >
            <div
              className={`message flex ${
                message.fromSelf || message.senderId === tutorData._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`relative group max-w-[65%] px-4 py-2 rounded-2xl text-sm ${
                  message.fromSelf || message.senderId === tutorData._id
                    ? "bg-[#0084ff] text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="mb-1">{message.message}</p>
                <span
                  className={`text-[11px] leading-none opacity-60 ${
                    message.fromSelf || message.senderId === tutorData._id
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {extractTime(message.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto bg-[#f0f2f5] p-4">
        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
    </div>
  );
}