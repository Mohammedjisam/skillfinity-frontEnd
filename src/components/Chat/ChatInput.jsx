import React, { useState } from "react";
import { Send, Paperclip, Smile } from 'lucide-react';

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
    <div className="border-t border-gray-200 bg-white p-4">
      <form 
        className="flex items-center space-x-2" 
        onSubmit={(event) => sendChat(event)}
      >
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600"
          aria-label="Attach file"
        >
          
        </button>
        <input
          type="text"
          placeholder="Type a message"
          className="flex-grow py-2 px-4 bg-gray-100 text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600"
          aria-label="Add emoji"
        >
          
        </button>
        <button 
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}