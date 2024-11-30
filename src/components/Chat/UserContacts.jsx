import React, { useState, useEffect } from "react";
import { Search } from 'lucide-react';

export default function UserContacts({ contacts, changeChat, currentChat }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts?.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4">
        <h2 className="text-2xl font-bold text-gray-800">Chats</h2>
      </div>
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredContacts && filteredContacts.length > 0 ? (
          filteredContacts.map((contact, index) => (
            <div
              key={contact.id || `contact-${index}`}
              className={`flex items-center p-4 cursor-pointer transition-all duration-300 ease-in-out ${
                currentChat?.id === contact.id
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => changeChat(contact)}
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl font-semibold text-white mr-4">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {contact.name}
                </h3>
                <p className="text-sm text-gray-500">Click to start chatting</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p className="text-lg font-semibold">No contacts found</p>
            <p className="mt-2">Try a different search or add new contacts</p>
          </div>
        )}
      </div>
    </div>
  );
}

