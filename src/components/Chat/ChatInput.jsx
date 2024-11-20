import React, { useState } from "react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
 
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 w-full">
      <form 
        className="flex items-center space-x-2 w-full" 
        onSubmit={(event) => sendChat(event)}
      >
        <input
          type="text"
          placeholder="Type your message here"
          className="flex-grow py-2 px-4 bg-gray-100 text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button 
          type="submit"
          className="bg-gray-800 text-white py-2 px-6 rounded-full hover:bg-primary-dark transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Send
        </button>
      </form>
    </div>
  );
}