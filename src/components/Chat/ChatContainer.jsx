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

  // Fetch chat messages when currentChat changes
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

  // Listen for new messages
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

  // Add incoming message to the chat
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);

  // Handle message sending
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

  // Check if user is near the bottom of the chat
  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const isAtBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop <=
      chatContainer.clientHeight + 50;

    setIsNearBottom(isAtBottom);
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll to the bottom if the user is near the bottom
  useEffect(() => {
    if (isNearBottom) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isNearBottom]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="chat-header bg-white border-b border-gray-200 p-4">
        <div className="user-details flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-600 mr-3">
            {currentChat?.name.charAt(0).toUpperCase()}
          </div>
          <div className="username">
            <h3 className="text-lg font-semibold">{currentChat?.name}</h3>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="chat-messages flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50"
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
                className={`content max-w-[70%] p-3 rounded-lg shadow ${
                  message.fromSelf || message.senderId === tutorData._id
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p>{message.message}</p>
                <span
                  className={`text-xs ${
                    message.fromSelf || message.senderId === tutorData._id
                      ? "text-blue-100"
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

      {/* Chat Input */}
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
