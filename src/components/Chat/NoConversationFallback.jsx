import React from "react";
import { User } from "lucide-react";

function NoConversationFallback() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center p-4">
      <User className="h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        No Conversation Selected
      </h2>
      <p className="text-gray-500 max-w-md mb-4">
        Choose a conversation from the sidebar to start chatting.
      </p>
    </div>
  );
}

export default NoConversationFallback;
