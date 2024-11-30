



import React from "react";
import { MessageSquare } from 'lucide-react';

function NoConversationFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center p-4">
      <MessageSquare className="h-16 w-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        No Conversation Selected
      </h2>
      <p className="text-gray-600 max-w-md mb-4">
        Choose a conversation from the sidebar or start a new chat to begin messaging.
      </p>
    </div>
  );
}

export default NoConversationFallback;