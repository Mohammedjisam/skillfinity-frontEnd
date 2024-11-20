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

  console.log("current chat ithaaaaaaaaa===>", currentChat);
  console.log("userdata chat ithaaaaaaaaa===>", userData);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axiosInstance.get("/message", {
        params: {
          from: userData._id,
          to: currentChat.id,
        },
      });
      setMessages(response.data);
    };

    if (currentChat) fetchMessages();
  }, [currentChat, userData]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

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

        console.log("message set cheyyan poova");
        setMessages((prevMessages) => [
          ...prevMessages,
          { fromSelf: true, message: msg, createdAt: new Date().toISOString() },
        ]);
        console.log("message set cheyyan poova");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [currentChat?.id, userData._id, socket]
  );

  useEffect(() => {
    const handleMsgReceive = (msg) => {
      setArrivalMessage({
        fromSelf: false,
        message: msg,
        createdAt: new Date().toISOString(),
      });
    };

    if (socket.current) {
      socket.current.on("msg-recieve", handleMsgReceive);
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve", handleMsgReceive);
      }
    };
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    console.log("mesg set aayiiii===>", messages);
  }, [messages]);



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
        {messages.map((message, index) => (
          <div
            ref={index === messages.length - 1 ? scrollRef : null}
            key={uuidv4()}
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
